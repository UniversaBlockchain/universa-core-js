import { Boss, BossDeserializable, BossSerializable } from 'unicrypto';
import Permission from './permission';
import { Role } from '../roles/role';

export default class ChangeOwnerPermission extends Permission implements BossSerializable {
  static DefaultName = "change_owner";
  static className = "ChangeOwnerPermission";

  constructor(role: Role, name: string = ChangeOwnerPermission.DefaultName) {
    super(role, {}, name);
  }

  static create(roleName: string, name: string = ChangeOwnerPermission.DefaultName) {
    return this.createLink(roleName, {}, name);
  }

  static deserializeFromBOSS(serialized: any): ChangeOwnerPermission {
    return new ChangeOwnerPermission(serialized.name, serialized.role);
  }
}

Boss.register("ChangeOwnerPermission",
  ChangeOwnerPermission as BossDeserializable<ChangeOwnerPermission>
);
