import { Boss, BossSerializable, BossDeserializable } from 'unicrypto';
import { Role, AvailableForOptions } from '../roles/role';
import RoleLink from '../roles/role_link';
import Permission from './permission';
import { omitBOSS } from '../../utils';

type ModifyPrimitive = null | string | number | Date;

interface ModifyDataParams {
  fields: { [key: string]: Array<ModifyPrimitive> }
}

export default class ModifyDataPermission extends Permission implements BossSerializable {
  params: ModifyDataParams;

  static className = "ModifyDataPermission";
  static DefaultName = "modify_data";

  constructor(
    role: Role,
    params: ModifyDataParams,
    name: string = ModifyDataPermission.DefaultName
  ) {
    super(role, params, name);

    this.params = params;
  }

  static create(
    roleName: string,
    params: ModifyDataParams,
    name: string = ModifyDataPermission.DefaultName
  ) {
    return this.createLink(roleName, params, name);
  }

  static deserializeFromBOSS(serialized: any): ModifyDataPermission {
    const params = omitBOSS(serialized, ['role', 'name']);

    return new ModifyDataPermission(serialized.role, params, serialized.name);
  }
}
