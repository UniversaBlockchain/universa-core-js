const Unicrypto = require('unicrypto');
const Network = require('./network');

Unicrypto.Network = Network;
Unicrypto.Topology = Network.Topology;

module.exports = Unicrypto;
