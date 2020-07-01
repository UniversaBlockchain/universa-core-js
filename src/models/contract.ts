import { Boss } from 'unicrypto';
import { Capsule } from './capsule';
import HashId from './hash_id';

export class Contract {
  bin: Uint8Array;
  version: number;
  type: string;
  signatures: Array<Uint8Array>;
  data: Uint8Array;
  capsule: Capsule;

  constructor(bin: Uint8Array) {
    const boss = new Boss();
    const raw = boss.load(bin);

    this.bin = bin;
    this.version = raw.version;
    this.type = raw.type;
    this.data = raw.data;
    this.signatures = raw.signatures;
    this.capsule = new Capsule(this.data);
  }

  get issuer() { return this.capsule.issuer; }
  get owner() { return this.capsule.owner; }
  get creator() { return this.capsule.creator; }

  get parent() { return this.capsule.contract.state.parent; }
  get origin() { return this.capsule.contract.state.origin; }

  get definition() { return this.capsule.contract.definition; }
  get state() {return this.capsule.contract.state; }

  get hashId() { return HashId.calculate(this.bin); }
}
