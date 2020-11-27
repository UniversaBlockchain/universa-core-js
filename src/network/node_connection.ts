import request from 'xhr-request';
import { abortable } from '../utils';
import { Node } from './node';
import { PrivateKey, PrivateKeySignOpts } from 'unicrypto';

import {
  Boss,
  randomBytes,
  encode64,
  SHA,
  SymmetricKey
} from 'unicrypto';

const CONNECTION_TIMEOUT = 1000;

export default class NodeConnection {
  node: Node;
  authKey: PrivateKey;
  nodeURL: string;
  sessionId: number | undefined;
  sessionKey: SymmetricKey | undefined;

  constructor(node: Node, authKey: PrivateKey, directConnection?: boolean) {
    this.node = node;
    this.authKey = authKey;

    this.nodeURL = node.https;
    if (directConnection) this.nodeURL = node.http;
  }

  async connect() {
    const clientNonce = randomBytes(47);
    const signatureOpts: PrivateKeySignOpts = { pssHash: "sha512" };

    console.log(`setting up protected connection to ${this.nodeURL}`);

    const clientKey = await this.authKey.publicKey.pack();

    const connectionData = await this.request("connect", {
      client_key: clientKey,
      jsapi: true
    }, { timeout: CONNECTION_TIMEOUT });

    this.sessionId = connectionData['session_id'];

    const authData = Boss.dump({
      client_nonce: clientNonce,
      server_nonce: connectionData['server_nonce']
    });

    const token = await this.request("get_token", {
      data: authData,
      signature: await this.authKey.sign(authData, signatureOpts),
      session_id: this.sessionId
    });

    const tokenData = token.data;
    const nodeKey = await this.node.getPublicKey();

    if (!nodeKey) throw new Error("Node key is undefined");

    const isVerified = await nodeKey.verify(
      tokenData, token.signature, signatureOpts
    );

    if (!isVerified) throw new Error("bad node signature");

    const params = Boss.load(tokenData);

    if (encode64(clientNonce) !== encode64(params['client_nonce']))
      throw new Error("nonce mismatch, authentication failed");

    const decryptedTokenBin = await this.authKey.decrypt(params['encrypted_token']);

    const decryptedToken = Boss.load(decryptedTokenBin);

    this.sessionKey = new SymmetricKey({ keyBytes: decryptedToken.sk });

    const response = await this.command("hello");

    if (response.status !== "OK")
      throw new Error(`wrong status ${response.status}, authentication failed`);

    console.log(`connected, system says: ${response.message}`);

    return this;
  }

  async command(name: string, params: any = {}, requestOptions: any = {}) {
    if (!this.sessionKey) throw new Error("not in session");

    const sk = this.sessionKey;
    const data = Boss.dump({ command: name, params });

    const req = this.request("command", {
      command: "command",
      params: await sk.encrypt(data),
      session_id: this.sessionId
    }, requestOptions);

    return abortable(new Promise((resolve, reject) => {
      req.then(async (response: any) => {
        const decrypted = await sk.decrypt(response.result);
        const result = Boss.load(decrypted);
        if (result.error) reject(result.error);
        else resolve(result.result);
      }).catch(reject);
    }), req);
  }

  request(path: string, params: any = {}, requestOptions: any = {}) {
    const url = `${this.nodeURL}/${path}`;
    const data = { requestData64: encode64(Boss.dump(params)) };

    return NodeConnection.request("POST", url, { data, ...requestOptions });
  }

  static request(method: string, url: string, options: any = {}) {
    var req;

    const promise = new Promise((resolve, reject) => {
      function onResponse(err: Error, data: any) {
        if (err) return reject(err);

        const answer = Boss.load(new Uint8Array(data));

        if (answer && answer.result === "ok") resolve(answer.response);
        else reject(answer);
      }

      const opts: any = {
        method,
        responseType: 'arraybuffer',
        headers: options.headers || {},
        timeout: options.timeout || 0
      };

      if (method !== "GET" && options.data) {
        opts.json = true;
        opts.body = options.data;
      }

      req = request(url, opts, onResponse);
    });

    return abortable(promise, req);
  }

  static xchangeRequest(method: string, url: string, options: any = {}) {
    var req;

    const promise = new Promise((resolve, reject) => {
      function onResponse(err: Error, data: any) {
        if (err) return reject(err);
        resolve(data);
      }

      const opts: any = {
        method,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      };

      if (method !== "GET" && options.data) {
        opts.json = true;
        opts.body = options.data;
      }

      req = request(url, opts, onResponse);
    });

    return abortable(promise, req);
  }
}
