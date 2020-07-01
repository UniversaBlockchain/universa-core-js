import { Role } from './role';

export class SimpleRole implements Role {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  static load(raw: any) {
    return new SimpleRole(raw.name);
  }
}
