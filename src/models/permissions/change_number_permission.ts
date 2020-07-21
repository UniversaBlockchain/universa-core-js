import { Boss, BossSerializable, BossDeserializable } from 'unicrypto';
import { Role, AvailableForOptions } from '../roles/role';
import RoleLink from '../roles/role_link';
import Permission from './permission';
import { omitBOSS } from '../../utils';

interface ChangeNumberParams {
  field_name: string,
  min_value?: string | number,
  min_step?: string | number,
  max_value?: string | number,
  max_step?: string | number
}

export default class ChangeNumberPermission extends Permission implements BossSerializable {
  params: ChangeNumberParams;

  static className = "ChangeNumberPermission";
  static DefaultName = "decrement_permission";

  constructor(
    role: Role,
    params: ChangeNumberOptions,
    name: string = ChangeNumberPermission.DefaultName
  ) {
    super(role, params, name);
  }

  static create(
    roleName: string,
    params: ChangeNumberOptions,
    name: string = ChangeNumberPermission.DefaultName
  ) {
    return this.createLink(roleName, params, name);
  }

  static deserializeFromBOSS(serialized: any): ChangeNumberPermission {
    const params = omitBOSS(serialized, ['role', 'name']);

    return new ChangeNumberPermission(serialized.role, params, serialized.name);
  }
}
