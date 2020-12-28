import { Boss, BossSerializable, BossDeserializable } from 'unicrypto';

class BossSingleton {
  private static instance: BossSingleton;
  private constructor() {}

  static getInstance(): BossSingleton {
    if (!BossSingleton.instance) {
      BossSingleton.instance = new BossSingleton();
    }

    return BossSingleton.instance;
  }

  register<T extends BossSerializable>(alias: string, clz: BossDeserializable<T>) {
    return Boss.register(alias, clz);
  }

  dump(data: any): Uint8Array {
    return Boss.dump(data);
  }

  load(packed: Uint8Array): any {
     return Boss.load(packed);
  }
}

export default BossSingleton;
