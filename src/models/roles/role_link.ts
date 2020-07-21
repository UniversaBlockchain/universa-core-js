import {
  KeyAddress,
  PublicKey,
  BossSerializable,
  BossDeserializable,
  Boss
} from 'unicrypto';

import { Role, AvailableForOptions, RoleDictionary } from './role';

interface RoleLinkSerialized {
  name: string,
  target_name: string
}

export default class RoleLink implements Role, BossSerializable {
  name: string;
  targetName: string;

  constructor(name: string, targetName: string) {
    this.name = name;
    this.targetName = targetName;
  }

  resolve(roles: RoleDictionary = {}, nestedLevel: number = 0) {
    if (nestedLevel >= 100) throw new Error(`Role "${this.name}" is circular`);

    const target = roles[this.targetName];

    if (!target) throw new Error(`Target role "${this.targetName}" is not found`);

    return target.resolve(roles, nestedLevel + 1);
  }

  async availableFor(options: AvailableForOptions) {
    const finalTarget = this.resolve(options.roles);

    return finalTarget.availableFor(options);
  }

  // BOSS serialization definitions

  static className = "RoleLink";

  serializeToBOSS() {
    return {
      'name': this.name,
      'target_name': this.targetName
    };
  }

  static deserializeFromBOSS(serialized: RoleLinkSerialized): RoleLink {
    return new RoleLink(serialized.name, serialized['target_name']);
  }
}

Boss.register("RoleLink", RoleLink as BossDeserializable<RoleLink>);
