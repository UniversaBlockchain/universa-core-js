import { BossSerializable } from 'unicrypto';
import BossSingleton from '../../boss';
const boss = BossSingleton.getInstance();
import Permission from './permission';
import { Role } from '../roles/role';

export default class RevokePermission extends Permission implements BossSerializable {
  static DefaultName = "revoke";
  static className = "RevokePermission";

  constructor(role: Role, name: string = RevokePermission.DefaultName) {
    super(role, {}, name);
  }

  static create(roleName: string, name: string = RevokePermission.DefaultName) {
    return new RevokePermission(this.makeLink(name, roleName), name);
  }

  static deserializeFromBOSS(serialized: any): RevokePermission {
    return new RevokePermission(serialized.role, serialized.name);
  }
}

boss.register("RevokePermission", RevokePermission);
