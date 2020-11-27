import { Boss } from 'unicrypto';
import { Role } from './roles/role';
import { UniversaContract } from './universa_contract';
import Permission from './permissions/permission';
import HashId from './hash_id';

interface CapsuleOptions {
  new?: Array<HashId>,
  revoking?: Array<HashId>
}

export interface CreateCapsuleOptions {
  definitionData?: any,
  stateData?: any,
  createdAt?: Date,
  expiresAt?: Date | string,
  permissions?: Array<Permission>
}

export default class Capsule {
  contract: UniversaContract;
  new: Array<HashId> = [];
  revoking: Array<HashId> = [];

  constructor(contract: UniversaContract, options?: CapsuleOptions) {
    this.contract = contract;

    if (options) {
      this.new = options.new || [];
      this.revoking = options.revoking || [];
    }
  }

  static unpack(bin: Uint8Array) {
    const raw = Boss.load(bin);

    return new Capsule(raw.contract, { new: raw.new, revoking: raw.revoking });
  }

  static create(issuer: Role, options?: CreateCapsuleOptions) {
    const opts = options || {};

    const contract = UniversaContract.create(issuer, {
      createdAt: opts.createdAt,
      expiresAt: opts.expiresAt
    });

    if (opts.definitionData) contract.definition.data = opts.definitionData;
    if (opts.stateData) contract.state.data = opts.stateData;

    if (opts.permissions)
      opts.permissions.forEach(p => contract.addPermission(p));

    return new Capsule(contract);
  }

  get issuer() { return this.contract.issuer; }
  get owner() { return this.contract.owner; }
  get creator() { return this.contract.creator; }

  get parent() { return this.contract.parent; }
  get origin() { return this.contract.origin; }

  get definition() { return this.contract.definition; }
  get state() { return this.contract.state; }

  pack() {
    return Boss.dump({
      contract: this.contract,
      new: this.new,
      revoking: this.revoking
    });
  }
}
