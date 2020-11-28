import request from 'xhr-request';
import { Node } from './node';
import Topology from './topology';
import { retry, abortable, readJSON, Cancelable } from '../utils';
import NodeConnection from './node_connection';
import TransactionPack from '../models/transaction_pack';
import Parcel from '../models/parcel';
import HashId from '../models/hash_id';

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface NetworkOptions {
  topologyKey?: string,
  topology?: Topology,
  topologyFile?: string,
  directConnection?: boolean
}

interface ContractState {
  isApproved: boolean,
  isTestnet: boolean,
  states: any
}

interface ParcelState {
  payment: any,
  payload: any
}

type ConnectionDict = { [id: string]: NodeConnection };

export default class Network {
  options: NetworkOptions;
  connections: ConnectionDict;
  topologyKey: string;
  directConnection: boolean;
  ready: Promise<void>;
  authKey: PrivateKey;
  setReady: any;
  topology: Topology | undefined;
  timeOffset: number | null;
  timeUpdatedAt: number | null;

  constructor(privateKey: PrivateKey, options?: NetworkOptions) {
    this.options = options || {};
    this.connections = {};
    this.topologyKey = this.options.topologyKey || "__universa_topology";
    this.directConnection = this.options.directConnection || false;
    this.ready = new Promise((resolve, reject) => { this.setReady = resolve; });
    this.authKey = privateKey;
    this.timeOffset = null;
    this.timeUpdatedAt = null;
  }

  size() {
    if (this.topology) return this.topology.size();

    throw new Error("You need to connect before accessing size");
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
    await this.topology.update(this.directConnection);
    // console.log(`Loaded network configuration, ${this.size()} nodes`);
    this.saveNewTopology();

    if (!this.timeOffset) await this.loadNetworkTime();

    this.setReady(true);

    return this;
  }

  async nodeConnection(nodeId: string) {
    if (!this.topology)
      throw new Error("can't establish connection without topology");

    const node = this.topology.getNode(nodeId);
    if (this.connections[nodeId]) return this.connections[nodeId];

    await this.ready;

    const connection = new NodeConnection(node, this.authKey, this.directConnection);
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
      attempts: 0,
      interval: 1000,
      onError: (e) => console.log(e, ` send command again`)
    }), req);
  }

  checkContract(
    id: HashId | Uint8Array | string,
    connection?: NodeConnection,
    requestOptions?: any) {
    let itemId: Uint8Array;
    if (typeof id === "string") itemId = decode64(id);
    else if (id.constructor.name === 'HashId') itemId = (id as HashId).composite3;
    else itemId = id as Uint8Array;

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

  isApprovedExtended(
    id: Uint8Array | string,
    trustLevel: number,
    onNodeResponse?: (response: any) => void
  ): Promise<ContractState> {
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
      let states = {};
      let isTestnet: boolean;

      const requests: Array<Cancelable<any>> = [];
      if (!self.topology) throw new Error("missing topology");
      const ids = Object.keys(self.topology.nodes);

      const isPending = (state: string) =>
        state.indexOf("PENDING") === 0 || state.indexOf("LOCKED") === 0;

      function success(status: boolean) {
        if (resultFound) return;

        resultFound = true;

        resolve({
          isApproved: status,
          isTestnet,
          states
        });
      }

      function failure(err: Error) {
        if (resultFound) return;

        resultFound = true;
        reject(err);
      }

      function processNext() {
        if (!resultFound && ids.length > 0) {
          const id = ids.pop();
          id && processNode(id);
        } else failure(new Error("not enough responses to find consensus"));
      }

      function processVote(state: string, nodeId: string) {
        if (resultFound) return;
        if (isPending(state)) return ids.unshift(nodeId);

        if (!states[state]) states[state] = 1;
        else states[state] += 1;

        if (state === "APPROVED") {
          positive++;
          if (positive >= Nt) return success(true);
        }
        else {
          negative++;
          if (negative >= N10) return success(false);
        }

        if (positive + negative >= Nt) processNext();
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

          if (onNodeResponse) onNodeResponse({ nodeId, itemResult });

          isTestnet = itemResult.isTestnet;

          processVote(itemResult.state, nodeId);
        } catch (err) {
          console.log("On check contract: ", err);
          if (ids.length > 0) processNext();
          else failure(new Error("not enough responses"));
        }
      }

      for (let i = 0; i < Nt; i++) processNext();
    });
  }

  isApproved(id: Uint8Array | string, trustLevel: number): Promise<boolean> {
    return this.isApprovedExtended(id, trustLevel).then(result => result.isApproved);
  }

  now() {
    if (!this.timeOffset)
      throw new Error('you should load network time before');

    const localTime = Date.now();

    return new Date(localTime + this.timeOffset);
  }

  async loadNetworkTime() {
    const url = 'https://xchange.mainnetwork.io/api/v1/utc';
    const response = await NodeConnection.xchangeRequest('GET', url);
    const uTime = (JSON.parse(response)).currentEpochSecond * 1000;
    const localTime = Date.now();

    this.timeOffset = uTime - localTime;
    this.timeUpdatedAt = localTime;
  }

  static async getCost(tpack: TransactionPack) {
    const url = 'https://xchange.mainnetwork.io/api/v1/contracts/cost';
    const binary = await tpack.pack();
    const data = { packedContract: encode64(binary) };


    return NodeConnection.xchangeRequest('POST', url, { data });
  }

  async registerParcel(parcel: Parcel) {
    const self = this;

    const packedItem = Boss.dump(parcel);
    const connection = await this.getRandomConnection();

    const paymentId = await parcel.payment.contract.hashId();
    const payloadId = await parcel.payload.contract.hashId();

    if (!paymentId || !payloadId) throw new Error('payment or payload wasn\'t saved!');
    // console.log("send command approve parcel");
    let response, error;

    try {
      const paymentState1 = await self.checkContract(paymentId, connection);
      console.log('payment state before approve parcel', paymentState1);

      response = await this.command('approveParcel',
        { packedItem },
        connection,
        { timeout: 3000 }
      );
    } catch (err) {
      error = err;

      const paymentState2 = await self.checkContract(paymentId, connection);
      console.log('payment state after approve parcel', paymentState2);

      return { payment: paymentState2.itemResult, payload: "", packedItem };
      // return this.registerParcel(parcel);
    }

    // await sleep(100);

    const paymentState = await finalState(paymentId);
    const payloadState = await finalState(payloadId);

    return {
      payment: paymentState,
      payload: payloadState
    };

    async function finalState(id: HashId) {
      async function check(response) {
        const { itemResult } = response;
        const { state } = itemResult;

        // console.log(state);

        if (!state.startsWith("PENDING")) return itemResult;

        await sleep(100);

        return await finalState(id);
      }

      const response = await self.checkContract(id, connection);

      return await check(response);
    }
  }
}
