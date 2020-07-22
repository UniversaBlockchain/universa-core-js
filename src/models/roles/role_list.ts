import {
  BossSerializable,
  BossDeserializable,
  Boss
} from 'unicrypto';

import { Role, AvailableForOptions, RoleDictionary } from './role';
import RoleLink from './role_link';

enum MODES {
  ANY = "ANY",
  ALL = "ALL",
  QUORUM = "QUORUM"
}

interface RoleListOptions {
  mode: MODES,
  roleNames?: Array<string>,
  roles?: Array<Role>,
  quorumSize?: number
}

export default class RoleList implements Role, BossSerializable {
  name: string;
  mode: MODES;
  roles: Array<Role> = [];
  quorumSize: number = 1;

  constructor(name: string, options: RoleListOptions) {
    const { mode, roleNames, roles, quorumSize } = options;

    if (!roleNames && !roles)
      throw new Error("Array of role names or roles must be provided");

    this.name = name;
    this.mode = mode;

    const createLink = (roleName: string) =>
      new RoleLink(`__${name}-${roleName}`, roleName);

    if (roles) this.roles = roles;
    if (roleNames) this.roles = roleNames.map(createLink);
    if (quorumSize) this.quorumSize = quorumSize;
  }

  static MODES = MODES;

  resolve(roles: RoleDictionary = {}, nestedLevel: number = 0) {
    if (nestedLevel >= 100) throw new Error(`Role "${this.name}" is circular`);

    return new RoleList(this.name, {
      mode: this.mode,
      roles: this.roles.map(role => role.resolve(roles, nestedLevel + 1)),
      quorumSize: this.quorumSize
    });
  }

  async availableFor(options: AvailableForOptions) {
    const finalTarget = this.resolve(options.roles);
    const totalRoles = finalTarget.roles.length;

    async function atLeastNPositive(N: number) {
      let counter = 0;
      let i = 0;

      while (counter < N && i < totalRoles) {
        const vote = await finalTarget.roles[i].availableFor(options);
        if (vote) counter++;
        i++;
      }

      return counter >= N;
    }

    switch (this.mode) {
      case MODES.ANY: return await atLeastNPositive(1);
      case MODES.QUORUM: return await atLeastNPositive(this.quorumSize);
      case MODES.ALL: return await atLeastNPositive(totalRoles);
    }
  }

  static className = "RoleList";

  serializeToBOSS() {
    return {
      'name': this.name,
      'mode': this.mode,
      'roles': this.roles,
      'quorumSize': this.quorumSize
    };
  }

  static deserializeFromBOSS(serialized: any): RoleList {
    return new RoleList(serialized.name, {
      mode: serialized.mode,
      roles: serialized.roles,
      quorumSize: serialized.quorumSize
    });
  }
}

Boss.register("RoleList", RoleList);
