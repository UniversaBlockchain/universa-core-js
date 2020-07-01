import { encode64, hashId } from 'unicrypto';

export default class HashId {
  composite3: Uint8Array;

  constructor(raw: any) {
    this.composite3 = raw.composite3;
  }

  static calculate(bin: Uint8Array) {
    return new HashId({ composite3: hashId(bin) });
  }

  static fromComposite(bin: Uint8Array) {
    return new HashId({ composite3: bin });
  }

  get base64() { return encode64(this.composite3); }
}
