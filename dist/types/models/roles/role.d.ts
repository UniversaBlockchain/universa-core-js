import { KeyAddress, PublicKey } from 'unicrypto';
export type RoleDictionary = {
    [roleName: string]: Role;
};
export declare abstract class Role {
    name: string;
    resolve(roles: RoleDictionary, nestedLevel?: number): Role;
    availableFor(options: AvailableForOptions): Promise<boolean>;
    getSimpleAddress(roles: RoleDictionary, ignoreRefs?: boolean): Promise<KeyAddress | null>;
}
export interface AvailableForOptions {
    keys?: Array<PublicKey>;
    addresses?: Array<KeyAddress>;
    roles?: RoleDictionary;
}
//# sourceMappingURL=role.d.ts.map