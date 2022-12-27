import { BossSerializable } from 'unicrypto';
import { Role } from '../roles/role';
import Permission from './permission';
interface ChangeNumberParams {
    field_name: string;
    min_value?: string | number;
    min_step?: string | number;
    max_value?: string | number;
    max_step?: string | number;
}
export default class ChangeNumberPermission extends Permission implements BossSerializable {
    params: ChangeNumberParams;
    static className: string;
    static DefaultName: string;
    constructor(role: Role, params: ChangeNumberParams, name?: string);
    static create(roleName: string, params: ChangeNumberParams, name?: string): ChangeNumberPermission;
    static deserializeFromBOSS(serialized: any): ChangeNumberPermission;
}
export {};
//# sourceMappingURL=change_number_permission.d.ts.map