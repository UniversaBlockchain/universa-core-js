import { BossSerializable } from 'unicrypto';
import Permission from './permission';
import { Role } from '../roles/role';
export default class ChangeOwnerPermission extends Permission implements BossSerializable {
    static DefaultName: string;
    static className: string;
    constructor(role: Role, name?: string);
    static create(roleName: string, name?: string): ChangeOwnerPermission;
    static deserializeFromBOSS(serialized: any): ChangeOwnerPermission;
}
//# sourceMappingURL=change_owner_permission.d.ts.map