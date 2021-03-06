import { BossSerializable } from 'unicrypto';
import BossSingleton from '../../boss';
const boss = BossSingleton.getInstance();
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
    params: ChangeNumberParams,
    name: string = ChangeNumberPermission.DefaultName
  ) {
    super(role, params, name);

    this.params = params;
  }

  static create(
    roleName: string,
    params: ChangeNumberParams,
    name: string = ChangeNumberPermission.DefaultName
  ) {
    return new ChangeNumberPermission(this.makeLink(name, roleName), params, name);
  }

  static deserializeFromBOSS(serialized: any): ChangeNumberPermission {
    const params = omitBOSS(serialized, ['role', 'name']);

    return new ChangeNumberPermission(serialized.role, params, serialized.name);
  }
}

boss.register("ChangeNumberPermission", ChangeNumberPermission);
