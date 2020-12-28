import {
  encode64,
  hashId,
  BossSerializable
} from 'unicrypto';
import BossSingleton from '../boss';
const boss = BossSingleton.getInstance();

interface HashIdSerialized {
  composite3: Uint8Array
}

export default class HashId implements BossSerializable {
  composite3: Uint8Array;

  constructor(composite3: Uint8Array) {
    this.composite3 = composite3;
  }

  static async calculate(bin: Uint8Array) {
    return new HashId(await hashId(bin));
  }

  get base64() { return encode64(this.composite3); }

  equals(hashId: HashId) { return this.base64 === hashId.base64; }

  static className = "HashId";

  serializeToBOSS() {
    return { composite3: this.composite3 };
  }

  static deserializeFromBOSS(serialized: HashIdSerialized): HashId {
    return new HashId(serialized.composite3)
  }

  static unpack(bin: Uint8Array): HashId {
    return boss.load(bin) as HashId;
  }

  pack() {
    return boss.dump(this);
  }
}

boss.register("HashId", HashId);
