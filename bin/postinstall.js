const fs = require('fs');
const path = require('path');
const gentlyCopy = require('gently-copy');

const moduleFolder = path.resolve(__dirname, '..', 'node_modules/unicrypto/dist');

let VERSION;

fs.readdirSync(moduleFolder).forEach(file => {
  const parts = file.split('.');
  if (parts[parts.length - 1] !== "wasm") return;

  parts.shift();
  parts.pop();
  VERSION = parts.join('.');
});

// node_modules/unicrypto/bin
let projectRoot = path.dirname(require.main.filename);

projectRoot = path.dirname(projectRoot);
projectRoot = path.dirname(projectRoot);
projectRoot = path.dirname(projectRoot);

const distPaths = ['build', 'public', 'dist'];

let copied = false;

distPaths.map(distPath => {
  const relative = path.resolve(projectRoot, distPath);

  if (!fs.existsSync(relative)) return;

  if (distPath !== "public") return copyWASM(relative);

  const jsPath = relative + '/js';

  if (fs.existsSync(jsPath)) copyWASM(jsPath);
  else copyWASM(relative);
});

if (!copied) console.log(`WARNING: Cannot find destination directory. Please, copy node_modules/unicrypto/dist/crypto.${VERSION}.wasm to your frontend public directory`);

function copyWASM(destination) {
  gentlyCopy([`../node_modules/unicrypto/dist/crypto.${VERSION}.wasm`], `${destination}/crypto.${VERSION}.wasm`);
  copied = true;
}
