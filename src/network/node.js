const {
  PublicKey,
  decode64,
  encode64,
  Boss
} = require('unicrypto');

const NodeConnection = require('./node_connection');

const forceHTTPS = (url) =>
  url.replace("http://", "https://").replace(":8080", ":443");

const GET_TOPOLOGY_TIMEOUT = 1000;

function difference(setA, setB) {
  let _difference = new Set(setA);

  for (let elem of setB) {
      _difference.delete(elem);
  }

  return _difference;
}

function isEqual(setA, setB) {
  if (setA.size !== setB.size) return false;

  const diff = difference(setA, setB);

  return diff.size === 0;
}

class Node {
  constructor(info) {
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

    this.https = forceHTTPS(this.domainURLs.values().next().value);
  }

  async getId() {
    await this.ready;

    return this.id;
  }

  async equals(node) {
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

  async getTopology() {
    await this.ready;

    const resp = await NodeConnection.request("GET", `${this.https}/topology`, {
      timeout: GET_TOPOLOGY_TIMEOUT
    });
    const { signature, packed_data: packed } = resp;
    const isVerified = await this.key.verifyExtended(signature, packed);

    if (!isVerified) throw new Error("node signature mismatch");

    const boss = new Boss();
    return boss.load(packed);
  }
}

module.exports = Node;
