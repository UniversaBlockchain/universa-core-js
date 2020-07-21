import { expect } from 'chai';
import 'mocha';

import {
  encode64,
  decode64,
  PrivateKey,
  KeyRecord,
  RoleSimple,
  RoleLink,
  RoleList,
  RoleDictionary,
  RevokePermission,
  Boss
} from '../src';

import { Dict } from '../src/utils';

const KEY_BIN = decode64("JgAcAQABvIEAxIA1enr/js+6wCO5AfidA7cxOAGF6un36HGCAlv8WiUwkZV8kUsN4KdCmEcjfDr6WBdnxfftD8uv3LbT3LzTo4rpMv0EkBVfC3s/HnK/kLrPyrnt3cycZdbF6P939DMFAyiUGmD1HFFlIfPCtGVszlIU4aRvPNLRfuSno52Iqe28gQCoPVqU6HYVl6RPbMxM0MwQr6mUNOOEh4TvxHdTMw6O1Qv+wTPu0bHocV6CcLx132FEKoVfcLrTj/bkjNiTpwSzkIlQIWhokljvhSD9ILniAkOgtbKGgDuQ2ikrcPHSSe+uRJXGlBkyxDVKR5i+6ZVQunJk4vdhfwRLOk2KYgEyIQ==");

describe('Permissions', () => {
  describe('RevokePermission', () => {
    it('should pack permission', async () => {
      const permission = RevokePermission.create("owner");

      console.log(permission);

      expect(1).to.equal(1);
    });
  });
});
