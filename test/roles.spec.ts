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
  Boss
} from '../src';

import { Dict } from '../src/utils';

const KEY_BIN = decode64("JgAcAQABvIEAxIA1enr/js+6wCO5AfidA7cxOAGF6un36HGCAlv8WiUwkZV8kUsN4KdCmEcjfDr6WBdnxfftD8uv3LbT3LzTo4rpMv0EkBVfC3s/HnK/kLrPyrnt3cycZdbF6P939DMFAyiUGmD1HFFlIfPCtGVszlIU4aRvPNLRfuSno52Iqe28gQCoPVqU6HYVl6RPbMxM0MwQr6mUNOOEh4TvxHdTMw6O1Qv+wTPu0bHocV6CcLx132FEKoVfcLrTj/bkjNiTpwSzkIlQIWhokljvhSD9ILniAkOgtbKGgDuQ2ikrcPHSSe+uRJXGlBkyxDVKR5i+6ZVQunJk4vdhfwRLOk2KYgEyIQ==");

describe('Roles', () => {
  describe('RoleSimple', () => {
    it('should create RoleSimple', async () => {
      const privateKey = await PrivateKey.unpack(KEY_BIN);
      const pub = privateKey.publicKey;
      const role = new RoleSimple("owner", { addresses: [pub.shortAddress] });
      const packed = Boss.dump(role);

      expect(encode64(packed)).to.equal("JyNuYW1lK293bmVyI2tleXMGS2FkZHJlc3Nlcw4XQ3VhZGRyZXNzvCUQuGLijoSylhFzt+uhvgJ5em4gvVKyF4Tpw/g0otMmPYc2SWr4G19fdFNLZXlBZGRyZXNzXVNTaW1wbGVSb2xl");
    });

    it('should read RoleSimple', async () => {
      const packed = decode64("JyNuYW1lK293bmVyI2tleXMOFxtrZXkXM3BhY2tlZMQKAR4IHAEAAcQBAQCBIzssfkHSzN4PKtznvxc+M341Xw+2jxiYcVEvWEc/Cg7Jb6f4uC5n10wFfOQqUUeL8XOsORx7Wck6jheFZSx9hwuaohdpK5Dv160ObeOtN26A0XnMT15f6jfjfJGH9faPIu0ASUcqWk+ZRSXYXTFJ1/ytYxSCZWf85CKIHu4yh31sXFqdZXcpFpyqSfezoXeoRQR9/vgD/uuj2IsIS5I9e44suSwJl/ODVs2sw5KOwc2GsK/XyUrx3SthVrfKWIfjFnRUHX8eRN9hKX7kEjS3pL6rAClzdHcjkqu/BfsyjvbXAzIr/xkJORH6gmrZEbMCHj6MpYyo40OjYjNjuzGNM19fdHlwZWNSU0FQdWJsaWNLZXldS0tleVJlY29yZEthZGRyZXNzZXMGXVNTaW1wbGVSb2xl");
      const role = Boss.load(packed) as RoleSimple;
      const record = role.keyRecords[0];

      if (record) {
        const key = await record.getKey();
        expect(encode64(key.fingerprint)).to.equal("B5vMBq43yqq8lA5Pd7nCzA15BKjGGoaDLu5GHEcOAWnm");
      } else expect.fail("KeyRecord not found in role");
    });

    it('should be available for correct keys', async () => {
      const packed = decode64("JgAcAQABvIEAxIA1enr/js+6wCO5AfidA7cxOAGF6un36HGCAlv8WiUwkZV8kUsN4KdCmEcjfDr6WBdnxfftD8uv3LbT3LzTo4rpMv0EkBVfC3s/HnK/kLrPyrnt3cycZdbF6P939DMFAyiUGmD1HFFlIfPCtGVszlIU4aRvPNLRfuSno52Iqe28gQCoPVqU6HYVl6RPbMxM0MwQr6mUNOOEh4TvxHdTMw6O1Qv+wTPu0bHocV6CcLx132FEKoVfcLrTj/bkjNiTpwSzkIlQIWhokljvhSD9ILniAkOgtbKGgDuQ2ikrcPHSSe+uRJXGlBkyxDVKR5i+6ZVQunJk4vdhfwRLOk2KYgEyIQ==");
      const privateKey = await PrivateKey.unpack(KEY_BIN);
      const pub = privateKey.publicKey;
      const role = new RoleSimple("owner", { addresses: [pub.shortAddress] });
      const isAvailable = await role.availableFor({ keys: [pub] });

      expect(isAvailable).to.equal(true);
    });
  });

  describe('RoleLink', () => {
    it('should create RoleLink', async () => {
      const packed = decode64("JyNuYW1lK293bmVyI2tleXMOFxtrZXkXM3BhY2tlZMQKAR4IHAEAAcQBAQCBIzssfkHSzN4PKtznvxc+M341Xw+2jxiYcVEvWEc/Cg7Jb6f4uC5n10wFfOQqUUeL8XOsORx7Wck6jheFZSx9hwuaohdpK5Dv160ObeOtN26A0XnMT15f6jfjfJGH9faPIu0ASUcqWk+ZRSXYXTFJ1/ytYxSCZWf85CKIHu4yh31sXFqdZXcpFpyqSfezoXeoRQR9/vgD/uuj2IsIS5I9e44suSwJl/ODVs2sw5KOwc2GsK/XyUrx3SthVrfKWIfjFnRUHX8eRN9hKX7kEjS3pL6rAClzdHcjkqu/BfsyjvbXAzIr/xkJORH6gmrZEbMCHj6MpYyo40OjYjNjuzGNM19fdHlwZWNSU0FQdWJsaWNLZXldS0tleVJlY29yZEthZGRyZXNzZXMGXVNTaW1wbGVSb2xl");
      const role = Boss.load(packed) as RoleSimple;
      const roleLink = new RoleLink("creator", role.name);

      expect(roleLink.targetName).to.equal("owner");
    });

    it('should pack RoleLink', async () => {
      const simplePacked = decode64("JyNuYW1lK293bmVyI2tleXMOFxtrZXkXM3BhY2tlZMQKAR4IHAEAAcQBAQCBIzssfkHSzN4PKtznvxc+M341Xw+2jxiYcVEvWEc/Cg7Jb6f4uC5n10wFfOQqUUeL8XOsORx7Wck6jheFZSx9hwuaohdpK5Dv160ObeOtN26A0XnMT15f6jfjfJGH9faPIu0ASUcqWk+ZRSXYXTFJ1/ytYxSCZWf85CKIHu4yh31sXFqdZXcpFpyqSfezoXeoRQR9/vgD/uuj2IsIS5I9e44suSwJl/ODVs2sw5KOwc2GsK/XyUrx3SthVrfKWIfjFnRUHX8eRN9hKX7kEjS3pL6rAClzdHcjkqu/BfsyjvbXAzIr/xkJORH6gmrZEbMCHj6MpYyo40OjYjNjuzGNM19fdHlwZWNSU0FQdWJsaWNLZXldS0tleVJlY29yZEthZGRyZXNzZXMGXVNTaW1wbGVSb2xl");
      const simpleRole = Boss.load(simplePacked) as RoleSimple;
      const linkRole = new RoleLink("director", simpleRole.name);
      const linkPacked = Boss.dump(linkRole);

      expect(encode64(linkPacked)).to.equal("HyNuYW1lQ2RpcmVjdG9yW3RhcmdldF9uYW1lK293bmVyG19fdENSb2xlTGluaw==");
    });

    it('should be available for correct keys', async () => {
      const privateKey = await PrivateKey.unpack(KEY_BIN);
      const publicKey = privateKey.publicKey;
      const owner = new RoleSimple("owner", { keys: [publicKey] });
      const creator = new RoleLink("creator", "owner");
      const roles = {
        "owner": owner,
        "creator": creator
      };

      const isAvailable = await creator.availableFor({ keys: [publicKey], roles });

      expect(isAvailable).to.equal(true);
    });

    it('should throw exception on circular role', async () => {
      const privateKey = await PrivateKey.unpack(KEY_BIN);
      const owner = new RoleLink("owner", "creator");
      const creator = new RoleLink("creator", "owner");
      const opts = { keys: [privateKey.publicKey] };
      let err;

      try {
        const isAvailable = await creator.availableFor(opts);
        expect.fail("Endless role check loop");
      } catch(e) {
        err = e;
      }

      expect(err.message).to.be.equal("Target role \"owner\" is not found");
    });
  });

  describe('RoleList', () => {
    let dir1Key: PrivateKey;
    let dir2Key: PrivateKey;
    let ass1Key: PrivateKey;

    let dir1: RoleSimple;
    let dir2: RoleSimple;
    let dir3: RoleLink;
    let assistant: RoleSimple;

    let roles: RoleDictionary;

    before(async () => {
      dir1Key = await PrivateKey.unpack(decode64("JgAcAQABvIEAwOMQDlTbIQ0UFuHKV9vdxrPHkBhjVJXJ6X3Z4Vy2ZxzE91Qw7iCnafg4BOiVlowgE7MTJpvWh7dedPkF5X9GcOtbobFkQfA9l8BtBYnqfFYR7LlOz00eZ8BHCix5hXWzc6lhLdCmSUghfK8w2xdfz+ualQpziZJq+2FsQeix6e28gQC2hiPalp/AJUsb8SBGQ7T1hXJihG1luH/RuoiG+zV5gwkaqxv9Kk5vGRG9QPxAtZVuCZ8ChXYx9YtiGeSi2oH8dQmLR+5yNpVrnAnltzQYz7wJyjtEUoI54SOi6FnMuz3/9WuQCm6KNQl0W8VsFqiTqbYM2gK/50FqHHzuKvTRww=="));
      dir2Key = await PrivateKey.unpack(decode64("JgAcAQABvIEA4EVVJlTJCHRXWtUBC82yr1NwMLl0U6P18bnGNR+ad5Z7NKBnx4g1Mb7djzKTLaBbBKJLllw+NleQSB58Aklf7X0nrT3mymb8Tu3o/sNBnK0s36BQa+FBqodKXLA3XDNz0MbUZQFHKsVrz5ohbfLwntMwVI6NeScCiOhDPIKytu28gQC4Jj5YV3lJ83cemjPglqLPFDOGaTT4Q/mfLN3M17NmMtUJgIByrhTjb/+oDmykAaULqDIu2nj5JD44KTgct+ui1suHba6gXqFnWK9k8+hfvVECRsxUn/KdP3WTq+hpBr1qM9hXxs5sFqvI4CapkTE843ZBc+22yTqJX06bNigudQ=="));
      ass1Key = await PrivateKey.unpack(decode64("JgAcAQABvIEA2ADj3GEX/qB5Z2hmOOufY8Re5ojmbZn1T4Lnpp/j0Tig+DuwTq6zE4MO4xEQTfRO2fIMRWQJZInyd7wG+9d/EQUzKfdv4js88W5DKTYf2bDV6PleVtWWQEV0UehBcxOU2tSmBpGQmmrYqgba6oJqWN87wtWDnuH9qMhkWovFTPm8gQDLrWQwrPiiMQjMMYozdw5P343euuX29pqH0li7SoSL3e9OziNFrGP4uXgywCSDRWETcW8efqQKtBxF0C7GpH9bdpKDCgkrNJuKg7SO9GzBojqzDNMKydPePHyk1P85EYMA0wEziOJG8tDlgyEnIkuEfiF0QHT4ihmcP9LazDnkhQ=="));

      dir1 = new RoleSimple("director1", { keys: [dir1Key.publicKey] });
      dir2 = new RoleSimple("director2", { keys: [dir2Key.publicKey] });
      dir3 = new RoleLink("director3", "director2");
      assistant = new RoleSimple("assistant", { keys: [ass1Key.publicKey] });

      roles = {
        "director1": dir1,
        "director2": dir2,
        "director3": dir3,
        "assistant": assistant
      };
    });

    it('should be available in ANY mode', async () => {
      const list = new RoleList("owner", {
        mode: RoleList.MODES.ANY,
        roles: [dir1, dir2, dir3, assistant]
      });

      const isAvailable = await list.availableFor({
        keys: [dir1Key.publicKey, dir2Key.publicKey],
        roles
      });

      expect(isAvailable).to.equal(true);
    });

    it('should be available in ANY mode (roleNames test)', async () => {
      const list = new RoleList("owner", {
        mode: RoleList.MODES.ANY,
        roleNames: [dir1.name, dir2.name, dir3.name, assistant.name]
      });

      const isAvailable = await list.availableFor({
        keys: [dir1Key.publicKey, dir2Key.publicKey],
        roles
      });

      expect(isAvailable).to.equal(true);
    });

    it('should be available in ALL mode (roleNames test)', async () => {
      const list = new RoleList("owner", {
        mode: RoleList.MODES.ALL,
        roleNames: [dir1.name, dir2.name, dir3.name, assistant.name]
      });

      const isAvailable = await list.availableFor({
        keys: [dir1Key.publicKey, dir2Key.publicKey],
        roles
      });

      expect(isAvailable).to.equal(false);
    });

    it('should be available in QURUM=3 mode', async() => {
      const list = new RoleList("owner", {
        mode: RoleList.MODES.QUORUM,
        quorumSize: 3,
        roleNames: [dir1.name, dir2.name, dir3.name, assistant.name]
      });

      const isAvailable = await list.availableFor({
        keys: [dir1Key.publicKey, dir2Key.publicKey],
        roles
      });

      expect(isAvailable).to.equal(true);
    });

    it('should not be available in QURUM=3 mode without one key', async() => {
      const list = new RoleList("owner", {
        mode: RoleList.MODES.QUORUM,
        quorumSize: 3,
        roleNames: [dir1.name, dir2.name, dir3.name, assistant.name]
      });

      const isAvailable = await list.availableFor({
        keys: [dir1Key.publicKey],
        roles
      });

      expect(isAvailable).to.equal(false);
    });

    it('should pack list role', async () => {
      const dir1 = new RoleSimple("director1", { addresses: [dir1Key.publicKey.shortAddress] });
      const dir2 = new RoleSimple("director2", { addresses: [dir2Key.publicKey.shortAddress] });
      const dir3 = new RoleLink("director3", "director2");
      const assistant = new RoleSimple("assistant", { addresses: [ass1Key.publicKey.shortAddress] });

      const list = new RoleList("owner", {
        mode: RoleList.MODES.QUORUM,
        quorumSize: 3,
        roles: [dir1, dir2, dir3, assistant]
      });

      const packed = encode64(Boss.dump(list));

      expect(packed).to.equal("LyNuYW1lK293bmVyI21vZGUzUVVPUlVNK3JvbGVzJicVS2RpcmVjdG9yMSNrZXlzBkthZGRyZXNzZXMOF0N1YWRkcmVzc7wlEDZAPdRMfQR2zj14GXecaluvU9kfGwCVdBaJdjAGvFhD8YrDSBtfX3RTS2V5QWRkcmVzc41TU2ltcGxlUm9sZScVS2RpcmVjdG9yMlUGZQ4XfbwlEJ1g30ZWY/ivXwe0FTPneMYqYEQ+/zLi2R3h7FcJHT1EkZvziI2VjZ0fFUtkaXJlY3RvcjNbdGFyZ2V0X25hbWWtjUNSb2xlTGluaycVS2Fzc2lzdGFudFUGZQ4XfbwlEPsyIKZCjyxVOxZpgjAnL91j/vLUHKKZoJt5FjjE+i3MsPr/yI2VjZ1TcXVvcnVtU2l6ZRiNQ1JvbGVMaXN0");
    });

    it('should read list role', async () => {
      const packed = decode64("LyNuYW1lK293bmVyI21vZGUzUVVPUlVNK3JvbGVzJicVS2RpcmVjdG9yMSNrZXlzBkthZGRyZXNzZXMOF0N1YWRkcmVzc7wlEDZAPdRMfQR2zj14GXecaluvU9kfGwCVdBaJdjAGvFhD8YrDSBtfX3RTS2V5QWRkcmVzc41TU2ltcGxlUm9sZScVS2RpcmVjdG9yMlUGZQ4XfbwlEJ1g30ZWY/ivXwe0FTPneMYqYEQ+/zLi2R3h7FcJHT1EkZvziI2VjZ0fFUtkaXJlY3RvcjNbdGFyZ2V0X25hbWWtjUNSb2xlTGluaycVS2Fzc2lzdGFudFUGZQ4XfbwlEPsyIKZCjyxVOxZpgjAnL91j/vLUHKKZoJt5FjjE+i3MsPr/yI2VjZ1TcXVvcnVtU2l6ZRiNQ1JvbGVMaXN0");
      const list = Boss.load(packed) as RoleList;
      expect(list.name).to.equal("owner");
    });
  });
});
