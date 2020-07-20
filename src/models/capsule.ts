import { Boss } from 'unicrypto';
import { Role } from './roles/role';
import UniversaContract from './universa_contract';
import HashId from './hash_id';

export default class Capsule {
  revoking: Array<HashId>;
  new: Array<HashId>;
  contract: UniversaContract;

  constructor(bin: Uint8Array) {
    const raw = Boss.load(bin);
    const rawNew: Array<any> = raw.new;
    const rawRevoking: Array<any> = raw.revoking;
    this.new = rawNew.map(rawHashId => new HashId(rawHashId));
    this.revoking = rawRevoking.map(rawHashId => new HashId(rawHashId));;
    this.contract = new UniversaContract(raw.contract);
  }

  get issuer() { return this.contract.issuer; }
  get owner() { return this.contract.owner; }
  get creator() { return this.contract.creator; }
}
