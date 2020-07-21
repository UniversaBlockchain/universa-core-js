import { Boss, BossSerializable, BossDeserializable } from 'unicrypto';
import { Role, AvailableForOptions } from '../roles/role';
import RoleLink from '../roles/role_link';
import Permission from './permission';
import { omitBOSS } from '../../utils';

type ModifyPrimitive = null | string | number | Date;

interface ModifyDataPermissionParams {
  fields: { [key: string]: Array<ModifyPrimitive> }
}

export default class ModifyDataPermission extends Permission implements BossSerializable {
  params: ModifyDataPermissionParams;

  static className = "ModifyDataPermission";
  static DefaultName = "modify_data";

  constructor(
    role: Role,
    params: ChangeNumberOptions,
    name: string = ModifyDataPermission.DefaultName
  ) {
    super(role, params, name);
  }

  static create(
    roleName: string,
    params: ChangeNumberOptions,
    name: string = ModifyDataPermission.DefaultName
  ) {
    return this.createLink(roleName, params, name);
  }

  static deserializeFromBOSS(serialized: any): ModifyDataPermission {
    const params = omitBOSS(serialized, ['role', 'name']);

    return new ModifyDataPermission(serialized.role, params, serialized.name);
  }
}
