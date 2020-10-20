## universa-core

Tools to perform basic operations with Universa networks and contracts

## Installation

### Node.js

For usage in an existing Node.js project, add it to your dependencies:

```
$ npm install universa-core
```

or with yarn:

```
$ yarn add universa-core
```


And use it with the following line wherever you need it:

```javascript
import { Network } from 'universa-core';
```

### Web

In root folder of package run

```bash
npm install
npm run build
```

In folder `dist` (public/js, build) there will be `uni.%version%.min.js` and `crypto.%version%.wasm`.

Simply copy two files to wherever you keep your vendor scripts and include
it as a script:

```html
<script src="path/to/uni.min.js"></script>
<script> const generator = Uni.PrivateKey.generate({ strength: 2048 }); </script>
```

## Contract

### Basic models

#### KeyRecord

KeyRecord is PublicKey container extended with extra data

```js
import { PublicKey, KeyRecord } from 'universa-core';

const pub: PublicKey;
const optionalData = { comment: "this is key record", author: "John Doe" };
const record = KeyRecord.create(pub, optionalData);

record.extra.comment === "this is key record"; // true
```

### Roles

#### Availability for keys/addresses

```js
const isAvailable1 = await role.availableFor({ keys: [publicKey] });
const isAvailable2 = await role.availableFor({ addresses: [publicKey.shortAddress] });
```

#### Simple Role
Simple role can be created both with addresses and public keys
```js
import {
  PublicKey,
  KeyRecord,
  RoleSimple
} from 'universa-core';

const pub: PublicKey;
const pub2: PublicKey;
const role = new RoleSimple("director", { addresses: [pub.shortAddress, pub2.longAddress] });
const role = new RoleSimple("assistant", { keys: [pub, pub2] });
```

Also, you can create simple role with KeyRecord
```js
import {
  PublicKey,
  KeyRecord,
  RoleSimple
} from 'universa-core';

const pub: PublicKey;
const record = KeyRecord.create(pub, { description: "main key" });
const role = new RoleSimple("director", { keyRecords: [record] });
```

#### Role Link
Create role that links to other role

```js
import { RoleLink, RoleSimple } from 'universa-core';

const roleSimple: RoleSimple;
const link1 = new RoleSimple("director", roleSimple.name);
const link2 = new RoleLink("assistant", "worker3");
```

#### Role List
Role List is role that represents logical combination of other roles

ANY mode to create role that available for any role in the list
```js
import { RoleList, RoleLink, RoleSimple } from 'universa-core';

const link1: RoleLink;
const link2: RoleLink;
const simple1: RoleSimple;

const list1 = new RoleList("founder", {
  mode: RoleList.MODES.ANY,
  roles: [link1, link2, simple1]
});

// or create list with role names
const list2 = new RoleList("founder", {
  mode: RoleList.MODES.ANY,
  roleNames: [link1.name, link2.name, simple1.name]
});
```

ALL mode to create role that available only if all roles from list available
```js
import { RoleList, RoleLink, RoleSimple } from 'universa-core';

const link1: RoleLink;
const link2: RoleLink;
const simple1: RoleSimple;

const list1 = new RoleList("founder", {
  mode: RoleList.MODES.ALL,
  roles: [link1, link2, simple1]
});
```

QUORUM mode to make role available if at least quorumSize(number) roles is available
```js
import { RoleList, RoleLink, RoleSimple } from 'universa-core';

const link1: RoleLink;
const link2: RoleLink;
const simple1: RoleSimple;

// list1 is available for any 2 roles from list
const list1 = new RoleList("founder", {
  mode: RoleList.MODES.QUORUM,
  roles: [link1, link2, simple1],
  quorumSize: 2
});
```

### Permissions
#### Revoke permission
Revoke permission grants permission to revoke contract to specific role

```js
import { RevokePermission } from 'universa-core';

const role: Role;

const revoke = new RevokePermission(role);
// or with custom permission name
const revokeAdmin = new RevokePermission(role, "revoke_admin");
// or with role name
const revoke2 = RevokePermission.create("owner");
```

#### Change owner permission
Change owner permission grants permission to change owner of contract

```js
import { ChangeOwnerPermission } from 'universa-core';

const admin: Role;

const changeOwner = new ChangeOwnerPermission(admin);
// or with custom permission name
const changeOwnerByAdmin = new ChangeOwnerPermission(admin, "change_admin");
// or with role name
const changeOwner2 = ChangeOwnerPermission.create("admin");
```

#### Change number permission
Change number permission grants permission to change number value of the specific field in state.data section of contract

```js
import { ChangeNumberPermission } from 'universa-core';

const admin: Role;

const params = {
  field_name: "amount", // field to change in state data
  min_value: "1",         // minimum value of field (string/number)
  max_value: "100",       // maximum value of field (string/number)
  min_step: "1",          // minimum step of value change per one revision (string/number)
  max_step: "5",          // maximum step of value change per one revision (string/number)
};

const changeNumber = new ChangeNumberPermission(admin, params);
// or with custom permission name
const changeNumberByAdmin = new ChangeNumberPermission(admin, params, "change_number_admin");
// or with role name
const changeNumber2 = ChangeNumberPermission.create("admin", params);

console.log(changeNumber.params); // params
```

#### Modify data permission
Modify data permission grants permission to change multitype value of the specific field in state.data section of contract with fixed set of values

```js
import { ModifyDataPermission } from 'universa-core';

const admin: Role;

const params = {
  fields: {
    amount: [10, 20], // amount field can contain only values 10 or 20
    textIdentifier: [], // textIdentifier can contain any value
    documentReference: [null, "referenceA", "referenceB"], // can be empty
    acceptedAt: [yesterday, tomorrow] // Date instances
  }
};

const modifyData = new ModifyDataPermission(admin, params);
// or with custom permission name
const modifyDataByAdmin = new ModifyDataPermission(admin, params, "modify_data_admin");
// or with role name
const modifyData2 = ModifyDataPermission.create("admin", params);

console.log(modifyData.params); // params
```

#### Split / join permission
Split / join permission grants permission to split or join contracts by specific number field when some of contract attribures are the same

```js
import { SplitJoinPermission } from 'universa-core';

const admin: Role;

const params = {
  field_name: "amount", // number field to split/join
  min_value: "15", // minimum value of amount (string/number)
  min_unit: "5", // minimum unit to split (string/number)
  join_match_fields: ["origin", "unit_currency"] // array of fields, that must be same
};

const splitJoin = new SplitJoinPermission(admin, params);
// or with custom permission name
const splitJoinByAdmin = new SplitJoinPermission(admin, params, "split_join_admin");
// or with role name
const splitJoin2 = SplitJoinPermission.create("admin", params);

console.log(splitJoin.params); // params
```

### Transaction Pack

Load transaction pack from binary
```js
import { TransactionPack, Boss } from 'universa-core';

const tpackBinary: Uint8Array;
const tpack = Boss.load(tpackBinary) as TransactionPack;

tpack.contract // Contract
tpack.referencedItems // Array<Contract>
tpack.subItems // Array<Contract>

// Get parent of main contract
const parent = await tpack.getItem(tpack.contract.parent);
```

### Contract

```js
const main = tpack.contract;

main.issuer // issuer role
main.owner // owner role
main.creator // creator role

main.parent // hash id of parent contract
main.origin // hash id of origin contract

main.definition // definition
main.state // state
```

## Network

### Connecting to network

Connect to network with default topology

```js
import { Network, PrivateKey } from 'universa-core';

// privateKey is PrivateKey instance
const network = new Network(privateKey);
let response;

try { await network.connect(); }
catch (err) { console.log("network connection error: ", err); }

try { response = await network.command("sping"); }
catch (err) { console.log("on network command:", err); }
```

Connect to network with topology, provided by file path

```js
import { Network, PrivateKey } from 'universa-core';

// privateKey is PrivateKey instance
const network = new Network(privateKey, {
  topologyFile: "/path/to/mainnet.json"
});
let response;

try { await network.connect(); }
catch (err) { console.log("network connection error: ", err); }

try { response = await network.command("sping"); }
catch (err) { console.log("on network command:", err); }
```

Connect to network with provided topology

```js
import { Network, PrivateKey, Topology } from 'universa-core';

const topology = await Topology.load(require("/path/to/mainnet.json"));

// privateKey is PrivateKey instance
const network = new Network(privateKey, { topology });
let response;

try { await network.connect(); }
catch (err) { console.log("network connection error: ", err); }

try { response = await network.command("sping"); }
catch (err) { console.log("on network command:", err); }
```

(Browser only) Connect to network and save topology to localStorage

```js
import { Network, PrivateKey } from 'universa-core';

// privateKey is PrivateKey instance
const network = new Network(privateKey, {
  topologyKey: "local_storage_key_to_store"
});
let response;

try { await network.connect(); }
catch (err) { console.log("network connection error: ", err); }

try { response = await network.command("sping"); }
catch (err) { console.log("on network command:", err); }
```

Connect to network and force HTTP connections to nodes

```js
import { Network, PrivateKey } from 'universa-core';

// privateKey is PrivateKey instance
const network = new Network(privateKey, {
  forceHTTP: true
});
let response;

try { await network.connect(); }
catch (err) { console.log("network connection error: ", err); }

try { response = await network.command("sping"); }
catch (err) { console.log("on network command:", err); }
```

### Topology

Load topology from file
```js
import { Topology } from 'universa-core';

const topology = await Topology.load(require("/path/to/mainnet.json"));
```

Get topology from network instance
```js
import { Network, PrivateKey } from 'universa-core';

// privateKey is PrivateKey instance
const network = new Network(privateKey);
await network.connect();

const { topology } = network; // Updated topology instance
```

Update topology
```js
import { Topology } from 'universa-core';

const topology = await Topology.load(require("/path/to/mainnet.json"));
const done = await topology.update(); // updates topology that then can be saved
```

Pack topology to save as file
```js
const fs = require('fs');
import { Network, PrivateKey } from 'universa-core';

// privateKey is PrivateKey instance
const network = new Network(privateKey);
const { topology } = network; // Topology instance

const packedTopology = topology.pack();
const json = JSON.stringify(packedTopology);
fs.writeFile('mainnet.json', json);
```

### Running commands

network.command(commandName, parameters) - returns Promise with result

```js
import { Network, PrivateKey } from 'universa-core';

// privateKey is PrivateKey instance
const network = new Network(privateKey);
let response;

try { await network.connect(); }
catch (err) { console.log("network connection error: ", err); }

try {
  // approvedId is Uint8Array
  response = await network.command("getState", {
    itemId: { __type: "HashId", composite3: approvedId }
  });
}
catch (err) { console.log("on network command:", err); }
```

### Check full contract status

Special command to check contract status over network
isApproved(contractId, trustLevel: Double) // Promise[Boolean]

```js
import { Network, PrivateKey } from 'universa-core';

// privateKey is PrivateKey instance
const network = new Network(privateKey);
let isApproved; // boolean

try { await network.connect(); }
catch (err) { console.log("network connection error: ", err); }

try {
  // approvedId can be Uint8Array or base64 string
  isApproved = await network.isApproved(approvedId, 0.6);
}
catch (err) { console.log("on network command:", err); }
```

## Running tests

Run tests
```bash
npm test
```

Run coverage
```bash
npm run coverage
```
