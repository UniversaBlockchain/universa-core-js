import { Boss, BossSerializable, shortId } from 'unicrypto';
import { Role, RoleDictionary } from './roles/role';
import RoleLink from './roles/role_link';
import HashId from './hash_id';
import Reference from './reference';
import Permission from './permissions/permission';
import RevokePermission from './permissions/revoke_permission';

export interface State {
  createdAt: Date,
  expiresAt: Date,
  owner: Role,
  creator: Role,
  data: any,
  revision: number,
  roles: RoleDictionary,
  parent: HashId | null,
  origin: HashId | null,
  branchId?: string | null,
  references?: Array<Reference>
}

export interface Definition {
  issuer: Role,
  permissions: { [id: string]: Permission },
  createdAt: Date,
  data: any,
  references?: Array<Reference>
}

interface UniversaContractSerialized {
  api_level: number,
  definition: any,
  state: any,
  transactional?: any
}

interface ContractCreateOptions {
  createdAt?: Date,
  expiresAt?: Date | string
}

const DEFAULT_EXPIRES_AT = 5; // years
const DEFAULT_API_LEVEL = 4;

function uniqueShortId(existing: Array<string>) {
  const maxIterations = 100000;
  let found = false;
  let id;
  let i = 0;

  while (i < maxIterations && !found) {
    id = shortId();
    if (existing.indexOf(id) !== -1) found = true;
    i++;
  }

  return id;
}

export class UniversaContract implements BossSerializable {
  apiLevel: number;
  definition: Definition;
  state: State;
  transactional: any;

  constructor(
    apiLevel: number,
    definition: Definition,
    state: State,
    transactional: any
  ) {
    this.apiLevel = apiLevel;
    this.definition = definition;
    this.state = state;
    this.transactional = transactional;
  }

  static create(issuer: Role, options?: ContractCreateOptions) {
    const opts = options || {};
    const expiresAtOpt = opts.expiresAt;

    const createdAt = opts.createdAt || new Date();
    let expiresAt = new Date(createdAt.getTime());

    if (!expiresAtOpt) {
      expiresAt.setFullYear(expiresAt.getFullYear() + DEFAULT_EXPIRES_AT);
    } else if (typeof expiresAtOpt === 'string') {
      const tpe = expiresAtOpt.slice(-1);
      const amount = parseInt(expiresAtOpt.slice(0, expiresAtOpt.length - 1));

      if (tpe === 'd') expiresAt.setDate(expiresAt.getDate() + amount);
      if (tpe === 'm') expiresAt.setMonth(expiresAt.getMonth() + amount);
      if (tpe === 'y') expiresAt.setFullYear(expiresAt.getFullYear() + amount);
    } else {
      expiresAt = expiresAtOpt;
    }

    const revokePermission = RevokePermission.create('owner');
    const revokeId = shortId();

    const definition: Definition = {
      createdAt,
      issuer,
      permissions: { [revokeId]: revokePermission },
      data: {},
      references: []
    };

    const state: State = {
      createdAt,
      creator: new RoleLink('creator', 'issuer'),
      revision: 1,
      owner: new RoleLink('owner', 'issuer'),
      expiresAt,
      data: {},
      parent: null,
      origin: null,
      branchId: null,
      roles: {},
      references: []
    };

    return new UniversaContract(DEFAULT_API_LEVEL, definition, state, null);
  }

  get issuer() { return this.definition.issuer; }
  get owner() { return this.state.owner; }
  get creator() { return this.state.creator; }

  get parent() { return this.state.parent; }
  get origin() { return this.state.origin; }

  addPermission(permission: Permission) {
    const id = uniqueShortId(Object.keys(this.definition.permissions));
    this.definition.permissions[id] = permission;
  }

  removePermission(permissionId: string) {
    delete this.definition.permissions[permissionId];
  }

  setParent(id: HashId) { this.state.parent = id; }
  setOrigin(id: HashId) { this.state.origin = id; }
  setCreatorTo(roleName: string) {
    this.state.creator = new RoleLink('creator', roleName);
  };

  incrementRevision() { this.state.revision += 1; }

  static className = "UniversaContract";

  serializeToBOSS() {
    const d = this.definition;
    const s = this.state;

    const definitionSerialized = {
      'issuer': d.issuer,
      'permissions': d.permissions,
      'created_at': d.createdAt,
      'data': d.data,
      'references': d.references
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
      'branch_id': s.branchId,
      'references': s.references
    };

    const serialized: UniversaContractSerialized = {
      api_level: this.apiLevel,
      definition: definitionSerialized,
      state: stateSerialized
    };

    if (this.transactional || this.transactional === null)
      serialized.transactional = this.transactional;

    return serialized;
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
      data: rawDefinition.data,
      references: rawDefinition.references || []
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
      branchId: rawState['branch_id'],
      references: rawState.references || []
    };

    return new UniversaContract(apiLevel, definition, state, serialized.transactional);
  }

  resetTransactional() { this.transactional = null; }
  createTransactional(id: string | null) {
    this.transactional = { id };
  }

  addReference(ref: Reference) {
    if (ref.type === Reference.TYPE_TRANSACTIONAL && !this.transactional)
      throw new Error('Can\'t add transactional reference: transaction is empty');

    if (ref.type === Reference.TYPE_TRANSACTIONAL) {
      this.transactional.references = this.transactional.references || [];
      this.transactional.references.push(ref);
    }

    if (ref.type === Reference.TYPE_EXISTING_DEFINITION) {
      this.definition.references = this.definition.references || [];
      this.definition.references.push(ref);
    }

    if (ref.type === Reference.TYPE_EXISTING_STATE) {
      this.state.references = this.state.references || [];
      this.state.references.push(ref);
    }
  }
}

Boss.register("UniversaContract", UniversaContract);
