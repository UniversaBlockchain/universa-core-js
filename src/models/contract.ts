import { Boss, KeyAddress, PublicKey, PrivateKey, encode64 } from 'unicrypto';
import Capsule from './capsule';
import Reference from './reference';
import { CreateCapsuleOptions } from './capsule';
import HashId from './hash_id';
import { Role } from './roles/role';

interface ContractOptions {
  type?: string,
  version?: number,
  binary?: Uint8Array
}

interface signedByOptions {
  address?: KeyAddress,
  publicKey?: PublicKey
}

export default class Contract {
  type: string;
  version: number;
  signatures: Array<Uint8Array>;
  data: Uint8Array;
  capsule: Capsule;
  binary: Uint8Array | null = null;

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
      this.binary = options.binary || this.binary;
    }
  }

  get issuer() { return this.capsule.issuer; }
  get owner() { return this.capsule.owner; }
  set owner(role: Role) { this.capsule.owner = role; }
  get creator() { return this.capsule.creator; }
  set creator(role: Role) { this.capsule.creator = role; }

  setCreatorTo(roleName: string) {
    this.capsule.contract.setCreatorTo(roleName);
  }

  get parent() { return this.capsule.parent; }
  get origin() { return this.capsule.origin; }

  get definition() { return this.capsule.definition; }
  get state() { return this.capsule.state; }
  get transactional() { return this.capsule.transactional; }

  hashId() {
    if (this.binary) return HashId.calculate(this.binary);
    else throw new Error('contract is not packed yet');
  }

  async getSignatureKeys() {
    const keys = [];
    const signaturesTotal = this.signatures.length;
    let i = 0;

    const query = this.signatures.map(async (signature) => {
      const { exts } = Boss.load(signature);
      const targetSignature = Boss.load(exts);

      return await PublicKey.unpack(targetSignature['pub_key']);
    });

    return await Promise.all(query);
  }

  async isSignedBy(options: signedByOptions) {
    const { publicKey, address } = options;
    let signed = false;
    let i = 0;
    const signaturesTotal = this.signatures.length;
    const data = this.data;
    const self = this;

    async function verify(index: number): Promise<boolean> {
      if (index >= signaturesTotal) return false;
      const signature = self.signatures[index];

      let pub = publicKey;
      if (!pub) {
        const { exts } = Boss.load(signature);
        const targetSignature = Boss.load(exts);

        pub = await PublicKey.unpack(targetSignature['pub_key']);
      }

      const verified = await pub.verifyExtended(signature, data);
      if (verified) return true;
      return await verify(index + 1);
    }

    return await verify(0);
  }

  async sign(privateKey: PrivateKey) {
    const isSigned = await this.isSignedBy({ publicKey: privateKey.publicKey });

    if (isSigned) return;

    const signature = await privateKey.signExtended(this.data);

    this.signatures.push(signature);
  }

  static create(issuer: Role, options: CreateCapsuleOptions) {
    const capsule = Capsule.create(issuer, options);

    return new Contract(capsule.pack());
  }

  packData() {
    this.data = this.capsule.pack();
    this.signatures = [];
  }

  pack() {
    const packed = Boss.dump({
      data: this.data,
      signatures: this.signatures,
      type: this.type,
      version: this.version
    });

    this.binary = packed;

    return packed;
  }

  async createRevision(createdAt?: Date) {
    const parentId = await this.hashId();

    if (!parentId || !this.binary)
      throw new Error('Can\'t create revision of draft contract');

    const newRevision = Contract.unpack(this.binary);
    const capsule = newRevision.capsule;
    const unicontract = capsule.contract;

    unicontract.incrementRevision();
    if (!unicontract.origin) unicontract.setOrigin(parentId);
    unicontract.setParent(parentId);
    unicontract.state.createdAt = createdAt || new Date();

    capsule.new = [];
    capsule.revoking = [parentId];

    return newRevision;
  }

  static unpack(binary: Uint8Array) {
    const raw = Boss.load(binary);

    return new Contract(raw.data, raw.signatures, {
      type: raw.type,
      version: raw.version,
      binary
    });
  }

  resetTransactional() { this.capsule.contract.resetTransactional(); }
  createTransactional(id: string | null) {
    this.capsule.contract.createTransactional(id);
  }

  addReference(ref: Reference) {
    this.capsule.contract.addReference(ref);
  }
}
