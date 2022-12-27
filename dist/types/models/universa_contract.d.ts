import { BossSerializable } from 'unicrypto';
import { Role, RoleDictionary } from './roles/role';
import HashId from './hash_id';
import Reference from './reference';
import Permission from './permissions/permission';
export interface State {
    createdAt: Date;
    expiresAt: Date;
    owner: Role;
    creator: Role;
    data: any;
    revision: number;
    roles: RoleDictionary;
    parent: HashId | null;
    origin: HashId | null;
    branchId?: string | null;
    references?: Array<Reference>;
}
export interface Definition {
    issuer: Role;
    permissions: {
        [id: string]: Permission;
    };
    createdAt: Date;
    data: any;
    references?: Array<Reference>;
}
interface UniversaContractSerialized {
    api_level: number;
    definition: any;
    state: any;
    transactional?: any;
}
interface ContractCreateOptions {
    createdAt?: Date;
    expiresAt?: Date | string;
}
export declare class UniversaContract implements BossSerializable {
    apiLevel: number;
    definition: Definition;
    state: State;
    transactional: any;
    constructor(apiLevel: number, definition: Definition, state: State, transactional: any);
    static create(issuer: Role, options?: ContractCreateOptions): UniversaContract;
    get issuer(): Role;
    get owner(): Role;
    set owner(role: Role);
    get creator(): Role;
    set creator(role: Role);
    get parent(): HashId | null;
    get origin(): HashId | null;
    addPermission(permission: Permission): void;
    removePermission(permissionId: string): void;
    setParent(id: HashId): void;
    setOrigin(id: HashId): void;
    setCreatorTo(roleName: string): void;
    incrementRevision(): void;
    static className: string;
    serializeToBOSS(): UniversaContractSerialized;
    static deserializeFromBOSS(serialized: UniversaContractSerialized): UniversaContract;
    resetTransactional(): void;
    createTransactional(id: string | null): void;
    addReference(ref: Reference): void;
}
export {};
//# sourceMappingURL=universa_contract.d.ts.map