import { encode64, hashId } from 'unicrypto';

interface HashIdSerialized {
  composite3: Uint8Array
}

export default class HashId {
  composite3: Uint8Array;

  constructor(raw: HashIdSerialized) {
    this.composite3 = raw.composite3;
  }

  static async calculate(bin: Uint8Array) {
    return new HashId({ composite3: await hashId(bin) });
  }

  static fromComposite(bin: Uint8Array) {
    return new HashId({ composite3: bin });
  }

  get base64() { return encode64(this.composite3); }
}
