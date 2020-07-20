import request from 'xhr-request';
import { Node } from './node';
import Topology from './topology';
import { retry, abortable, readJSON } from '../utils';
import NodeConnection from './node_connection';

const mainnet = require('../../mainnet.json');

import {
  Boss,
  decode64,
  encode64,
  PrivateKey
} from 'unicrypto';

const CHECK_CONTRACT_TIMEOUT = 2000;

function createHashId(id: Uint8Array) {
  return {
    __type: "HashId",
    composite3: id
  };
}

interface NetworkOptions {
  topologyKey?: string,
  topology?: Topology,
  topologyFile?: string
}

type ConnectionDict = { [id: string]: NodeConnection };

export default class Network {
  options: NetworkOptions;
  connections: ConnectionDict;
  topologyKey: string;
  ready: Promise<void>;
  authKey: PrivateKey;
  setReady: any;
  topology: Topology | undefined;

  constructor(privateKey: PrivateKey, options?: NetworkOptions) {
    this.options = options || {};
    this.connections = {};
    this.topologyKey = this.options.topologyKey || "__universa_topology";
    this.ready = new Promise((resolve, reject) => { this.setReady = resolve; });
    this.authKey = privateKey;
  }

  size() {
    if (this.topology) return this.topology.size();
  }

  async getLastTopology() {
    if (typeof window !== 'undefined') {
      const bin = localStorage.getItem(this.topologyKey);

      if (bin) {
        return Topology.load(Boss.load(decode64(bin)));
      }
    }

    if (this.options.topology) return this.options.topology;

    if (this.options.topologyFile) {
      const packed = await readJSON(this.options.topologyFile);
      return Topology.load(packed);
    }

    return Topology.load(mainnet);
  }

  saveNewTopology() {
    if (typeof window === 'undefined') return;

    if (!this.topology) throw new Error("Can't save undefined topology");
    const packed = this.topology.pack();
    localStorage.setItem(this.topologyKey, encode64(Boss.dump(packed)));
  }

  async connect() {
    this.topology = await this.getLastTopology();
    // console.log(`Connecting to the Universa network`);
    await this.topology.update();
    // console.log(`Loaded network configuration, ${this.size()} nodes`);
    this.saveNewTopology();
    this.setReady(true);

    return this;
  }

  async nodeConnection(nodeId: string) {
    if (!this.topology)
      throw new Error("can't establish connection without topology");

    const node = this.topology.getNode(nodeId);
    if (this.connections[nodeId]) return this.connections[nodeId];

    await this.ready;

    const connection = new NodeConnection(node, this.authKey);
    await connection.connect();
    this.connections[nodeId] = connection;

    return connection;
  }

  async getRandomConnection() {
    await this.ready;

    if (!this.topology)
      throw new Error("can't establish connection without topology");

    return this.nodeConnection(this.topology.getRandomNodeId());
  }

  command(
    name: string,
    options?: any,
    connection?: NodeConnection,
    requestOptions?: any
  ) {
    let req: any, conn: NodeConnection;

    const run = async () => {
      conn = conn || connection || await this.getRandomConnection();

      req = conn.command(name, options, requestOptions);

      return await req;
    };

    return abortable(retry(run, {
      attempts: 5,
      interval: 1000,
      // onError: (e) => console.log(`${e}, send command again`)
    }), req);
  }

  checkContract(
    id: Uint8Array | string,
    connection?: NodeConnection,
    requestOptions?: any) {
    let itemId: Uint8Array;
    if (typeof id === "string") itemId = decode64(id);
    else itemId = id;

    const hashId = createHashId(itemId);

    return this.command("getState", { itemId: hashId }, connection, requestOptions || {});
  }

  checkParcel(id: Uint8Array | string) {
    let itemId: Uint8Array;
    if (typeof id === "string") itemId = decode64(id);
    else itemId = id;

    const hashId = createHashId(itemId);

    return this.command("getParcelProcessingState", { parcelId: hashId });
  }

  isApproved(id: Uint8Array | string, trustLevel: number): Promise<boolean> {
    const self = this;

    return new Promise((resolve, reject) => {
      let tLevel = trustLevel;
      if (tLevel > 0.9) tLevel = 0.9;

      // const end = new Date((new Date()).getTime() + millisToWait).getTime();
      const size = self.size();
      if (!size) throw new Error("missing topology");

      let Nt = Math.ceil(size * tLevel);
      if (Nt < 1) Nt = 1;
      const N10 = (Math.floor(size * 0.1)) + 1;
      const Nn = Math.max(Nt + 1, N10);
      let resultFound = false;

      let positive = 0;
      let negative = 0;
      const requests = [];
      if (!self.topology) throw new Error("missing topology");
      const ids = Object.keys(self.topology.nodes);

      const isPending = (state: string) =>
        state.indexOf("PENDING") === 0 || state.indexOf("LOCKED") === 0;

      function success(status: boolean) {
        if (resultFound) return;

        resultFound = true;
        resolve(status);
      }

      function failure(err: Error) {
        if (resultFound) return;

        resultFound = true;
        reject(err);
      }

      function processNext() {
        if(!resultFound && ids.length > 0) {
          const id = ids.pop();
          id && processNode(id);
        }
      }

      function processVote(state: string, nodeId: string) {
        if (resultFound) return;
        if (isPending(state)) return ids.unshift(nodeId);
        if (state === "APPROVED") {
          positive++;
          if (positive >= Nt) return success(true);
        }
        else {
          negative++;
          if (negative >= N10) return success(false);
        }
      }

      async function processNode(nodeId: string) {
        if (resultFound) return;

        try {
          const conn = await self.nodeConnection(nodeId);
          if (resultFound) return;

          const req = self.checkContract(id, conn, {
            timeout: CHECK_CONTRACT_TIMEOUT
          });
          requests.push(req);
          const response = await req;
          const { itemResult } = response;
          const { state } = itemResult;
          processVote(response.itemResult.state, nodeId);
        } catch (err) {
          if (ids.length > 0) processNext();
          else failure(new Error("not enough responses"));
        }
      }

      for (let i = 0; i < Nt; i++) processNext();
    });
  }
}
