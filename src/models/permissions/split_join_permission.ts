import { Boss, BossSerializable, BossDeserializable } from 'unicrypto';
import { Role, AvailableForOptions } from '../roles/role';
import RoleLink from '../roles/role_link';
import Permission from './permission';
import { omitBOSS } from '../../utils';

interface SplitJoinParams {
  field_name: string,
  min_value?: string | number,
  min_unit?: string | number,
  join_match_fields: Array<string>
}

export default class SplitJoinPermission extends Permission implements BossSerializable {
  params: SplitJoinParams;

  static className = "SplitJoinPermission";
  static DefaultName = "split_join";

  constructor(
    role: Role,
    params: SplitJoinParams,
    name: string = SplitJoinPermission.DefaultName
  ) {
    super(role, params, name);

    this.params = params;
  }

  static create(
    roleName: string,
    params: SplitJoinParams,
    name: string = SplitJoinPermission.DefaultName
  ) {
    return this.createLink(roleName, params, name);
  }

  static deserializeFromBOSS(serialized: any): SplitJoinPermission {
    const params = omitBOSS(serialized, ['role', 'name']);

    return new SplitJoinPermission(serialized.role, params, serialized.name);
  }
}

Boss.register("SplitJoinPermission", SplitJoinPermission);
