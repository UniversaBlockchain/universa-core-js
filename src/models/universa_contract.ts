import { Boss, BossSerializable } from 'unicrypto';
import { Role } from './roles/role';
import HashId from './hash_id';
import { RoleDictionary } from './roles/role';
import Permission from './permissions/permission';

interface State {
  createdAt: Date,
  expiresAt: Date,
  owner: Role,
  creator: Role,
  data: any,
  revision: number,
  roles: RoleDictionary,
  parent: HashId | null,
  origin: HashId | null,
  branchId: string | null,
  // references: Array[Reference] | null
}

interface Definition {
  issuer: Role,
  permissions: { [id: string]: Permission },
  createdAt: Date,
  data: any
}

interface UniversaContractSerialized {
  api_level: number,
  definition: any,
  state: any
}

export default class UniversaContract implements BossSerializable {
  apiLevel: number;
  definition: Definition;
  state: State;

  constructor(apiLevel: number, definition: Definition, state: State) {
    this.apiLevel = apiLevel;
    this.definition = definition;
    this.state = state;
  }

  get issuer() { return this.definition.issuer; }
  get owner() { return this.state.owner; }
  get creator() { return this.state.creator; }

  get parent() { return this.state.parent; }
  get origin() { return this.state.origin; }

  static className = "UniversaContract";

  serializeToBOSS() {
    const d = this.definition;
    const s = this.state;

    const definitionSerialized = {
      'issuer': d.issuer,
      'permissions': d.permissions,
      'created_at': d.createdAt,
      'data': d.data
    };

    const stateSerialized = {
      'created_at': s.createdAt,
      'expires_at': s.expiresAt,
      'owner': s.owner,
      'created_by': s.creator,
      'data': s.data,
      'revision': s.revision,
      'roles': s.roles,
      'parent': s.parent,
      'origin': s.origin,
      'branch_id': s.branchId
    };

    return {
      api_level: this.apiLevel,
      definition: definitionSerialized,
      state: stateSerialized
    };
  }

  static deserializeFromBOSS(
    serialized: UniversaContractSerialized
  ): UniversaContract {
    const apiLevel = serialized['api_level'];
    const rawDefinition = serialized.definition;
    const rawState = serialized.state;
    let stateRoles = rawState.roles || {};

    // FIXME: some deprecated contracts contain roles as array, ignore it
    if (stateRoles instanceof Array) stateRoles = {};

    const definition = {
      issuer: rawDefinition.issuer,
      permissions: rawDefinition.permissions,
      createdAt: rawDefinition['created_at'],
      data: rawDefinition.data
    };

    const state = {
      createdAt: rawState['created_at'],
      expiresAt: rawState['expires_at'],
      owner: rawState.owner,
      creator: rawState['created_by'],
      data: rawState.data,
      revision: rawState.revision,
      roles: stateRoles,
      parent: rawState.parent,
      origin: rawState.origin,
      branchId: rawState['branch_id']
    };

    return new UniversaContract(apiLevel, definition, state);
  }
}

Boss.register("UniversaContract", UniversaContract);
