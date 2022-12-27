import { Role } from './roles/role';
import { UniversaContract } from './universa_contract';
import Permission from './permissions/permission';
import HashId from './hash_id';
interface CapsuleOptions {
    new?: Array<HashId>;
    revoking?: Array<HashId>;
}
export interface CreateCapsuleOptions {
    definitionData?: any;
    stateData?: any;
    createdAt?: Date;
    expiresAt?: Date | string;
    permissions?: Array<Permission>;
    owner?: Role;
}
export default class Capsule {
    contract: UniversaContract;
    new: Array<HashId>;
    revoking: Array<HashId>;
    constructor(contract: UniversaContract, options?: CapsuleOptions);
    static unpack(bin: Uint8Array): Capsule;
    static create(issuer: Role, options?: CreateCapsuleOptions): Capsule;
    get issuer(): Role;
    get owner(): Role;
    set owner(role: Role);
    get creator(): Role;
    set creator(role: Role);
    get parent(): HashId | null;
    get origin(): HashId | null;
    get definition(): import("./universa_contract").Definition;
    get state(): import("./universa_contract").State;
    get transactional(): any;
    pack(): Uint8Array;
}
export {};
//# sourceMappingURL=capsule.d.ts.map