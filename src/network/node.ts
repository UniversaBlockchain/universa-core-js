import NodeConnection from './node_connection';

import {
  PublicKey,
  decode64,
  encode64
} from 'unicrypto';
import BossSingleton from '../boss';
const boss = BossSingleton.getInstance();

const forceHTTPS = (url: string) =>
  url.replace("http://", "https://").replace(":8080", ":443");

const forceHTTP = (url: string) =>
  url.replace("https://", "http://").replace(":443", ":8080");

const GET_TOPOLOGY_TIMEOUT = 1000;

function difference(setA: Set<string>, setB: Set<string>) {
  let _difference = new Set(setA);

  setB.forEach((elem) => _difference.delete(elem));

  return _difference;
}

function isEqual(setA: Set<string>, setB: Set<string>) {
  if (setA.size !== setB.size) return false;

  const diff = difference(setA, setB);

  return diff.size === 0;
}

export interface NodeInfo {
  name: string,
  number: number,
  domain_urls: Array<string>,
  direct_urls: Array<string>,
  key: Uint8Array
}

export class Node {
  id: string | undefined;
  key: PublicKey | undefined;
  name: string;
  http: string;
  https: string;
  ready: Promise<void>;
  keyBIN: Uint8Array;
  number: number;
  domainURLs: Set<string>;
  directURLs: Set<string>;

  constructor(info: NodeInfo) {
    this.name = info.name;
    this.number = info.number;
    this.domainURLs = new Set(info.domain_urls);
    this.directURLs = new Set(info.direct_urls);

    let keyBIN = info.key;
    if (typeof keyBIN === "string") keyBIN = decode64(keyBIN);

    this.keyBIN = keyBIN;

    const self = this;

    this.ready = PublicKey.unpack(keyBIN).then(key => {
      self.key = key;
      self.id = encode64(key.fingerprint);
    });

    const domainURL = this.domainURLs.values().next().value;

    if (this.directURLs.size)
      this.http = this.directURLs.values().next().value;
    else
      this.http = forceHTTP(domainURL);

    this.https = forceHTTPS(domainURL);
  }

  async getId() {
    await this.ready;

    return this.id;
  }

  async getPublicKey() {
    await this.ready;

    return this.key;
  }

  async equals(node: Node) {
    await this.ready;

    if (node.name !== this.name) return false;
    if (node.number !== this.number) return false;
    if (await node.getId() !== await this.getId()) return false;
    if (!isEqual(this.domainURLs, node.domainURLs)) return false;
    if (!isEqual(this.directURLs, node.directURLs)) return false;

    return true;
  }

  info() {
    return {
      name: this.name,
      number: this.number,
      domain_urls: Array.from(this.domainURLs),
      direct_urls: Array.from(this.directURLs),
      key: encode64(this.keyBIN)
    };
  }

  async getTopology(directConnection?: boolean) {
    await this.ready;

    let url = this.https;
    if (directConnection) url = this.http;

    const resp = await NodeConnection.request("GET", `${url}/topology`, {
      timeout: GET_TOPOLOGY_TIMEOUT
    });
    const { signature, packed_data: packed } = resp;
    if (!this.key) throw new Error("node initialization failed (key is undefined)");
    const isVerified = await this.key.verifyExtended(signature, packed);

    if (!isVerified) throw new Error("node signature mismatch");

    return boss.load(packed);
  }
}
