import { Role } from './role';

export class RoleList implements Role {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  static load(raw: any) {
    return new RoleList(raw.name);
  }
}
