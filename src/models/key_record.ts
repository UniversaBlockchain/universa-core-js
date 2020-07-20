import {
  PublicKey,
  BossSerializable,
  BossDeserializable,
  Boss
} from 'unicrypto';

import { Primitive, Dict, omitBOSS } from '../utils';

export default class KeyRecord implements BossSerializable {
  keyPacked: Uint8Array;
  keyLoader: Promise<PublicKey>;
  key: PublicKey | null = null;
  extra: Dict = {};

  constructor(keyPacked: Uint8Array, extra?: Dict, key?: PublicKey) {
    this.keyPacked = keyPacked;

    if (key) {
      this.key = key;
      this.keyLoader = new Promise(resolve => resolve(key));
    }
    else this.keyLoader = PublicKey.unpack(keyPacked);

    if (extra) this.extra = extra;
  }

  async getKey() {
    if (this.key) return this.key;

    return await this.keyLoader;
  }

  setExtra(extra: Dict) { this.extra = extra; }

  static create(key: PublicKey, extra: Dict = {}) {
    return new KeyRecord(key.packed, extra, key);
  }

  static className = "KeyRecord";

  serializeToBOSS() {
    const key = {
      '__t': 'RSAPublicKey',
      'packed': this.keyPacked
    };

    return Object.assign({ key }, this.extra);
  }

  static deserializeFromBOSS(serialized: any): KeyRecord {
    return new KeyRecord(serialized.key.packed, omitBOSS(serialized, ['key']));
  }
}

Boss.register("KeyRecord", KeyRecord as BossDeserializable<KeyRecord>);
