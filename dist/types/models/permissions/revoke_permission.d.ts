import { BossSerializable } from 'unicrypto';
import Permission from './permission';
import { Role } from '../roles/role';
export default class RevokePermission extends Permission implements BossSerializable {
    static DefaultName: string;
    static className: string;
    constructor(role: Role, name?: string);
    static create(roleName: string, name?: string): RevokePermission;
    static deserializeFromBOSS(serialized: any): RevokePermission;
}
//# sourceMappingURL=revoke_permission.d.ts.map