import BossSingleton from '../boss';
const boss = BossSingleton.getInstance();
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
  permissions?: Array<Permission>,
  owner?: Role
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
    const raw = boss.load(bin);

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

    if (opts.owner) contract.owner = opts.owner;

    return new Capsule(contract);
  }

  get issuer() { return this.contract.issuer; }
  get owner() { return this.contract.owner; }
  set owner(role: Role) { this.contract.owner = role; }
  get creator() { return this.contract.creator; }
  set creator(role: Role) { this.contract.creator = role; }

  get parent() { return this.contract.parent; }
  get origin() { return this.contract.origin; }

  get definition() { return this.contract.definition; }
  get state() { return this.contract.state; }
  get transactional() { return this.contract.transactional; }

  pack() {
    return boss.dump({
      contract: this.contract,
      new: this.new,
      revoking: this.revoking
    });
  }
}
