import { KeyAddress, PublicKey } from 'unicrypto';

export type RoleDictionary = { [roleName: string]: Role };

// FIXME: tsc can't operate with abstract classes for some reason
export abstract class Role {
  name: string = "";

  resolve(roles: RoleDictionary, nestedLevel: number = 0): Role {
    throw new Error("must be implemented in subclass");
  }

  availableFor(options: AvailableForOptions): Promise<boolean> {
    throw new Error("must be implemented in subclass");
  }

  getSimpleAddress(roles: RoleDictionary, ignoreRefs: boolean = true): Promise<KeyAddress | null> {
    throw new Error("must be implemented in subclass");
  }
}

export interface AvailableForOptions {
  keys?: Array<PublicKey>,
  addresses?: Array<KeyAddress>,
  roles?: RoleDictionary
}
