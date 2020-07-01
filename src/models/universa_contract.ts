import { Boss } from 'unicrypto';
import { Role } from './roles/role';
import { RoleFactory } from './roles/role_factory';
import HashId from './hash_id';

type RoleDictionary = { [roleName: string]: Role };

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
  createdAt: Date,
  data: any,
  // permissions: Array<Permission>
}

export default class UniversaContract {
  apiLevel: number;
  definition: Definition;
  state: State;

  constructor(raw: any) {
    this.apiLevel = raw['api_level'];
    const rawDefinition = raw.definition;
    const rawState = raw.state;
    let stateRoles = rawState.roles || {};

    // FIXME: some deprecated contracts contain roles as array, ignore it
    if (stateRoles instanceof Array) stateRoles = {};

    this.definition = {
      createdAt: rawDefinition['created_at'],
      issuer: RoleFactory.load(rawDefinition.issuer),
      data: rawDefinition.data,
      // permissions: rawDefinition.permissions
    };

    this.state = {
      createdAt: rawState['created_at'],
      expiresAt: rawState['expires_at'],
      owner: RoleFactory.load(rawState.owner),
      creator: RoleFactory.load(rawState['created_by']),
      data: rawState.data,
      revision: rawState.revision,
      roles: loadRoles(stateRoles),
      parent: rawState.parent ? new HashId(rawState.parent) : null,
      origin: rawState.origin ? new HashId(rawState.origin) : null,
      branchId: rawState['branch_id']
    };
  }

  get owner() { return this.state.owner; }
  get issuer() { return this.definition.issuer; }
  get creator() { return this.state.creator; }
}

function loadRoles(rolesDict: any) {
  const roles: RoleDictionary = {};

  for (var roleName in rolesDict) {
    roles[roleName] = RoleFactory.load(rolesDict[roleName]);
  }

  return roles;
}
