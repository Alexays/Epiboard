#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const zipFolder = require('zip-folder');

const DEST_DIR = path.join(__dirname, '../dist');

const extractExtensionData = () => {
  const extPackageJson = require('../package.json');

  return {
    name: extPackageJson.name,
    version: extPackageJson.version
  }
};

const buildZip = (src, dist, zipFilename) => {
  console.info(`Building ${zipFilename}...`);

  return new Promise((resolve, reject) => {
    zipFolder(src, path.join(dist, zipFilename), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const main = () => {
  const {
    name,
    version
  } = extractExtensionData();
  const zipFilename = `${name}-v${version}.zip`;

  buildZip(DEST_DIR, path.join(__dirname, '../'), zipFilename)
    .then(() => console.info('OK'))
    .catch(console.err);
};

main();
