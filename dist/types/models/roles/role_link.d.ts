import { KeyAddress, BossSerializable } from 'unicrypto';
import { Role, AvailableForOptions, RoleDictionary } from './role';
interface RoleLinkSerialized {
    name: string;
    target_name: string;
}
export default class RoleLink implements Role, BossSerializable {
    name: string;
    targetName: string;
    constructor(name: string, targetName: string);
    resolve(roles?: RoleDictionary, nestedLevel?: number): Role;
    getSimpleAddress(roles?: RoleDictionary, ignoreRefs?: boolean): Promise<KeyAddress | null>;
    availableFor(options: AvailableForOptions): Promise<boolean>;
    static className: string;
    serializeToBOSS(): {
        name: string;
        target_name: string;
    };
    static deserializeFromBOSS(serialized: RoleLinkSerialized): RoleLink;
}
export {};
//# sourceMappingURL=role_link.d.ts.map