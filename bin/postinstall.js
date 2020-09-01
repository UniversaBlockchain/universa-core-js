const fs = require('fs');
const path = require('path');
const gentlyCopy = require('gently-copy');

// // node_modules/unicrypto/bin
let projectRoot = path.dirname(require.main.filename);

projectRoot = path.dirname(projectRoot);
projectRoot = path.dirname(projectRoot);
projectRoot = path.dirname(projectRoot);

const distPaths = ['build', 'public', 'dist'];

let copiedBuild = false;

function copyBuild(destination) {
  const CORE_VERSION = process.env.npm_package_version;
  let root = path.dirname(require.main.filename);
  root = path.dirname(root);

  gentlyCopy([`${root}/dist/uni.min.js`], `${destination}/uni.v${CORE_VERSION}.min.js`);
  copiedBuild = true;
}

distPaths.map(distPath => {
  const relative = path.resolve(projectRoot, distPath);

  if (!fs.existsSync(relative)) return;

  if (distPath !== "public") return copyBuild(relative);

  const jsPath = relative + '/js';

  if (fs.existsSync(jsPath)) copyBuild(jsPath);
  else copyBuild(relative);
});

if (!copiedBuild) console.log(`WARNING: Cannot find destination directory. Please, copy node_modules/universa-core/dist/uni.v${CORE_VERSION}.min.js to your frontend public directory`);
