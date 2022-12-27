import { BossSerializable } from 'unicrypto';
import { Role, AvailableForOptions, RoleDictionary } from './role';
declare enum MODES {
    ANY = "ANY",
    ALL = "ALL",
    QUORUM = "QUORUM"
}
interface RoleListOptions {
    mode: MODES;
    roleNames?: Array<string>;
    roles?: Array<Role>;
    quorumSize?: number;
}
export default class RoleList implements Role, BossSerializable {
    name: string;
    mode: MODES;
    roles: Array<Role>;
    quorumSize: number;
    constructor(name: string, options: RoleListOptions);
    static MODES: typeof MODES;
    resolve(roles?: RoleDictionary, nestedLevel?: number): RoleList;
    getSimpleAddress(roles?: RoleDictionary, ignoreRefs?: boolean): Promise<import("unicrypto").KeyAddress | null>;
    availableFor(options: AvailableForOptions): Promise<boolean>;
    static className: string;
    serializeToBOSS(): {
        name: string;
        mode: MODES;
        roles: Role[];
        quorumSize: number;
    };
    static deserializeFromBOSS(serialized: any): RoleList;
}
export {};
//# sourceMappingURL=role_list.d.ts.map