import { Boss } from 'unicrypto';

class BossRegistry {
  private static _instance: BossRegistry;

  registry: { [alias: string]: typeof BossSerializable } = {};

  constructor() {
  }

  register(alias: string, serializableClass: typeof BossSerializable): void {
    this.registry[alias] = serializableClass;
    // console.log(this.registry);
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
}

export abstract class BossSerializable {
  // type Constructor<T> = Function & { prototype: T }

  constructor(public binary: Uint8Array) {
    // const boss = new Boss();
    // const json = boss.load(binary);

    BossSerializable.fromJSON(json);
  }

  abstract toJSON(): any;
  abstract static fromJSON(jsonObject: any): BossSerializable;
}

export const Registry = BossRegistry.Instance;
