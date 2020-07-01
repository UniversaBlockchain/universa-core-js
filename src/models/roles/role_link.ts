import { Role } from './role';

export class RoleLink implements Role {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  static load(raw: any) {
    return new RoleLink(raw.name);
  }
}
