import { Role } from './role';
import { SimpleRole } from './simple_role';
import { RoleLink } from './role_link';
import { RoleList } from './role_list';

export abstract class RoleFactory {
  constructor() {}

  static load(raw: any) {
    const roleType = raw.__type || raw.__t;

    if (roleType === 'SimpleRole') return SimpleRole.load(raw);
    if (roleType === 'RoleLink') return RoleLink.load(raw);
    if (roleType === 'RoleList') return RoleList.load(raw);

    throw new Error(`unknown role type ${raw.__type}`);
  }
}
