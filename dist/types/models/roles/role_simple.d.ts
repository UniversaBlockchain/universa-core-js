import { KeyAddress, PublicKey, BossSerializable } from 'unicrypto';
import { Role, AvailableForOptions, RoleDictionary } from './role';
import KeyRecord from '../key_record';
interface RoleSimpleOptions {
    keys?: Array<PublicKey>;
    addresses?: Array<KeyAddress>;
    keyRecords?: Array<KeyRecord>;
    anonIds?: Array<any>;
}
export default class RoleSimple implements Role, BossSerializable {
    name: string;
    keyRecords: Array<KeyRecord>;
    addresses: Array<KeyAddress>;
    anonIds: Array<any>;
    constructor(name: string, options: RoleSimpleOptions);
    resolve(roles: RoleDictionary, nestedLevel?: number): this;
    getSimpleAddress(roles?: RoleDictionary, ignoreRefs?: boolean): Promise<KeyAddress | null>;
    availableFor(options: AvailableForOptions): Promise<boolean>;
    static className: string;
    serializeToBOSS(): {
        name: string;
        keys: KeyRecord[];
        addresses: KeyAddress[];
        anonIds: any[];
    };
    static deserializeFromBOSS(serialized: any): RoleSimple;
}
export {};
//# sourceMappingURL=role_simple.d.ts.map