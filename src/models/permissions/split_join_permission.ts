import { Boss, BossSerializable, BossDeserializable } from 'unicrypto';
import { Role, AvailableForOptions } from '../roles/role';
import RoleLink from '../roles/role_link';
import Permission from './permission';
import { omitBOSS } from '../../utils';

interface SplitJoinPermissionParams {
  field_name: string,
  min_value?: string | number,
  min_unit?: string | number,
  join_match_fields: Array<string>
}

export default class SplitJoinPermission extends Permission implements BossSerializable {
  params: SplitJoinPermissionParams;

  static className = "SplitJoinPermission";
  static DefaultName = "split_join";

  constructor(
    role: Role,
    params: ChangeNumberOptions,
    name: string = SplitJoinPermission.DefaultName
  ) {
    super(role, params, name);
  }

  static create(
    roleName: string,
    params: ChangeNumberOptions,
    name: string = SplitJoinPermission.DefaultName
  ) {
    return this.createLink(roleName, params, name);
  }

  static deserializeFromBOSS(serialized: any): SplitJoinPermission {
    const params = omitBOSS(serialized, ['role', 'name']);

    return new SplitJoinPermission(serialized.role, params, serialized.name);
  }
}
