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

In folder `dist` there will be `uni.min.js`.

Simply copy `dist/uni.min.js` to wherever you keep your vendor scripts and include
it as a script:

```html
<script src="path/to/uni.min.js"></script>
```

## Usage

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
