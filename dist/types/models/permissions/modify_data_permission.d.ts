import { BossSerializable } from 'unicrypto';
import { Role } from '../roles/role';
import Permission from './permission';
type ModifyPrimitive = null | string | number | Date;
interface ModifyDataParams {
    fields: {
        [key: string]: Array<ModifyPrimitive>;
    };
}
export default class ModifyDataPermission extends Permission implements BossSerializable {
    params: ModifyDataParams;
    static className: string;
    static DefaultName: string;
    constructor(role: Role, params: ModifyDataParams, name?: string);
    static create(roleName: string, params: ModifyDataParams, name?: string): ModifyDataPermission;
    static deserializeFromBOSS(serialized: any): ModifyDataPermission;
}
export {};
//# sourceMappingURL=modify_data_permission.d.ts.map