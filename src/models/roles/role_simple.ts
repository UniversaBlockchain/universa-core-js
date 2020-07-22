import {
  KeyAddress,
  PublicKey,
  BossSerializable,
  BossDeserializable,
  Boss
} from 'unicrypto';

import { Role, AvailableForOptions, RoleDictionary } from './role';
import KeyRecord from '../key_record';
import { isSuperset, createAddressSet } from '../../utils';

interface RoleSimpleOptions {
  keys?: Array<PublicKey>,
  addresses?: Array<KeyAddress>,
  keyRecords?: Array<KeyRecord>
}

export default class RoleSimple implements Role, BossSerializable {
  name: string;
  keyRecords: Array<KeyRecord> = [];
  addresses: Array<KeyAddress> = [];

  constructor(name: string, options: RoleSimpleOptions) {
    this.name = name;

    if (options.addresses) this.addresses = options.addresses;
    if (options.keyRecords) this.keyRecords = options.keyRecords;
    if (options.keys)
      this.keyRecords = options.keys.map(key => KeyRecord.create(key));
  }

  resolve() { return this; }

  async availableFor(options: AvailableForOptions) {
    const keyLoaders = this.keyRecords.map(record => record.getKey());
    const roleKeys = await Promise.all(keyLoaders);
    const roleAddresses = createAddressSet(roleKeys, this.addresses);
    const providedAddresses = createAddressSet(options.keys, options.addresses);

    return isSuperset(providedAddresses, roleAddresses);
  }

  static className = "RoleSimple";

  serializeToBOSS() {
    return {
      name: this.name,
      keys: this.keyRecords,
      addresses: this.addresses
    };
  }

  static deserializeFromBOSS(serialized: any): RoleSimple {
    const records: Array<KeyRecord> = serialized.keys || [];
    const addresses: Array<KeyAddress> = serialized.addresses || [];

    return new RoleSimple(serialized.name, {
      keyRecords: records,
      addresses: addresses
    });
  }
}

Boss.register("SimpleRole", RoleSimple);
