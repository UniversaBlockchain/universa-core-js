const request = require('xhr-request');
const { abortable } = require('../utils');

const {
  Boss,
  randomBytes,
  encode64,
  SHA,
  SymmetricKey
} = require('unicrypto');

const CONNECTION_TIMEOUT = 1000;

class NodeConnection {
  constructor(node, authKey, options) {
    this.node = node;
    this.authKey = authKey;
    this.options = options;
  }

  async connect() {
    const url = this.node.https;
    const clientNonce = randomBytes(47);
    const boss = new Boss();
    const signatureOpts = { pssHash: 'sha512' };

    console.log(`setting up protected connection to ${url}`);

    const connectionData = await this.request("connect", {
      client_key: await this.authKey.publicKey.packed(),
      jsapi: true
    }, { timeout: CONNECTION_TIMEOUT });

    this.sessionId = connectionData['session_id'];

    const authData = boss.dump({
      client_nonce: clientNonce,
      server_nonce: connectionData['server_nonce']
    });

    const token = await this.request("get_token", {
      data: authData,
      signature: await this.authKey.sign(authData, signatureOpts),
      session_id: this.sessionId
    });

    const tokenData = token.data;
    const isVerified = await this.node.key.verify(
      tokenData, token.signature, signatureOpts
    );

    if (!isVerified) throw new Error("bad node signature");

    const params = boss.load(tokenData);

    if (encode64(clientNonce) !== encode64(params['client_nonce']))
      throw new Error("nonce mismatch, authentication failed");

    const decryptedTokenBin = await this.authKey.decrypt(params['encrypted_token']);

    const decryptedToken = boss.load(decryptedTokenBin);

    this.sessionKey = new SymmetricKey({ keyBytes: decryptedToken.sk });

    const response = await this.command("hello");

    if (response.status !== "OK")
      throw new Error(`wrong status ${response.status}, authentication failed`);

    console.log(`connected, system says: ${response.message}`);

    return this;
  }

  async command(name, params = {}, requestOptions = {}) {
    if (!this.sessionKey) throw new Error("not in session");

    const sk = this.sessionKey;
    const boss = new Boss();
    const data = boss.dump({ command: name, params });

    const req = this.request("command", {
      command: "command",
      params: await sk.encrypt(data),
      session_id: this.sessionId
    }, requestOptions);

    return abortable(new Promise((resolve, reject) => {
      req.then(async (response) => {
        const decrypted = await sk.decrypt(response.result);
        const result = boss.load(decrypted);
        if (result.error) reject(result.error);
        else resolve(result.result);
      }).catch(reject);
    }), req);
  }

  request(path, params = {}, requestOptions = {}) {
    const url = `${this.node.https}/${path}`;
    const boss = new Boss();
    const data = { requestData64: encode64(boss.dump(params)) };

    return NodeConnection.request("POST", url, { data, ...requestOptions });
  }

  static request(method, url, options = {}) {
    var req;

    const promise = new Promise((resolve, reject) => {
      function onResponse(err, data) {
        if (err) return reject(err);

        const boss = new Boss();
        const answer = boss.load(new Uint8Array(data));

        if (answer && answer.result === "ok") resolve(answer.response);
        else reject(answer);
      }

      const opts = {
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
}

module.exports = NodeConnection;
