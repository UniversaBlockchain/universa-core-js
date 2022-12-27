import { BossSerializable } from 'unicrypto';
import { Role } from '../roles/role';
import Permission from './permission';
interface SplitJoinParams {
    field_name: string;
    min_value?: string | number;
    min_unit?: string | number;
    join_match_fields: Array<string>;
}
export default class SplitJoinPermission extends Permission implements BossSerializable {
    params: SplitJoinParams;
    static className: string;
    static DefaultName: string;
    constructor(role: Role, params: SplitJoinParams, name?: string);
    static create(roleName: string, params: SplitJoinParams, name?: string): SplitJoinPermission;
    static deserializeFromBOSS(serialized: any): SplitJoinPermission;
}
export {};
//# sourceMappingURL=split_join_permission.d.ts.map