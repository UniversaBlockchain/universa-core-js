import { Role, AvailableForOptions } from '../roles/role';
import RoleLink from '../roles/role_link';
type Params = {
    [key: string]: any;
};
export default class Permission {
    name: string;
    role: Role;
    params: Params;
    constructor(role: Role, params: Params, name?: string);
    static DefaultName: string;
    static makeLink(name: string, roleName: string): RoleLink;
    availableFor(options: AvailableForOptions): Promise<boolean>;
    serializeToBOSS(): {
        name: string;
        role: Role;
    } & Params;
}
export {};
//# sourceMappingURL=permission.d.ts.map