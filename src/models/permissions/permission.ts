import { KeyAddress, PublicKey } from 'unicrypto';
import { Role, AvailableForOptions } from '../roles/role';
import RoleLink from '../roles/role_link';

type Params = { [key: string]: any };

export default class Permission {
  name: string;
  role: Role;
  params: Params;

  constructor(
    role: Role,
    params: Params,
    name: string = Permission.DefaultName
  ) {
    this.name = name;
    this.role = role;
    this.params = params;
  }

  static DefaultName: string;

  static makeLink(
    name: string,
    roleName: string
  ) {
    return new RoleLink(`@${name}`, roleName);
  }

  availableFor(options: AvailableForOptions) {
    return this.role.availableFor(options);
  }

  serializeToBOSS() {
    return Object.assign({
      'name': this.name,
      'role': this.role
    }, this.params);
  }
}

