import { KeyAddress, PublicKey } from 'unicrypto';

export type RoleDictionary = { [roleName: string]: Role };

export abstract class Role {
  name: string;

  resolve(roles: RoleDictionary, nestedLevel: number = 0): Role;
  availableFor(options: AvailableForOptions): Promise<boolean>;
}

export interface AvailableForOptions {
  keys?: Array<PublicKey>,
  addresses?: Array<KeyAddress>,
  roles?: RoleDictionary
}
