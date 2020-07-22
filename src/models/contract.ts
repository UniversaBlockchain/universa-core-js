import { Boss } from 'unicrypto';
import Capsule from './capsule';
import HashId from './hash_id';

interface ContractOptions {
  type?: string,
  version?: number,
  originalBinary?: Uint8Array
}

export default class Contract {
  type: string;
  version: number;
  signatures: Array<Uint8Array>;
  data: Uint8Array;
  capsule: Capsule;
  originalBinary: Uint8Array | null = null;

  constructor(
    data: Uint8Array,
    signatures?: Array<Uint8Array>,
    options?: ContractOptions
  ) {
    this.type = "unicapsule";
    this.version = 4;
    this.data = data;
    this.capsule = Capsule.unpack(data);
    this.signatures = signatures || [];

    if (options) {
      this.type = options.type || this.type;
      this.version = options.version || this.version;
      this.originalBinary = options.originalBinary || this.originalBinary;
    }
  }

  get issuer() { return this.capsule.issuer; }
  get owner() { return this.capsule.owner; }
  get creator() { return this.capsule.creator; }

  get parent() { return this.capsule.parent; }
  get origin() { return this.capsule.origin; }

  get definition() { return this.capsule.definition; }
  get state() {return this.capsule.state; }

  hashId() {
    if (this.originalBinary) return HashId.calculate(this.originalBinary);
    else return null;
  }

  packData() {
    this.data = this.capsule.pack();
    this.signatures = [];
  }

  pack() {
    return Boss.dump({
      data: this.data,
      signatures: this.signatures,
      type: this.type,
      version: this.version
    });
  }

  static unpack(binary: Uint8Array) {
    const raw = Boss.load(binary);

    return new Contract(raw.data, raw.signatures, {
      type: raw.type,
      version: raw.version,
      originalBinary: binary
    });
  }
}
