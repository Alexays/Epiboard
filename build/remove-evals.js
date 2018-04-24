#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const glob = require('glob');

const BUNDLE_DIR = path.join(__dirname, '../dist/static/js');

const evalRegexForProduction = /;([a-z])=function\(\){return this}\(\);try{\1=\1\|\|Function\("return this"\)\(\)\|\|\(0,eval\)\("this"\)}catch\(t\){"object"==typeof window&&\(\1=window\)}/g;
const evalRegexForDevelopment = /;\s*\/\/ This works in non-strict mode\s*([a-z])\s*=\s*\(\s*function\(\)\s*\{\s*return this;\s*}\)\(\);\s*try\s*{\s*\/\/\s*This works if eval is allowed(?:\s*|.+){1,14}/g;

const removeEvals = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const regex = process.env.NODE_ENV === 'production' ? evalRegexForProduction : evalRegexForDevelopment;

      if (!regex.test(data)) {
        reject(`No CSP specific code found in ${file}.`);
        return;
      }

      data = data.replace(regex, '=window;');

      fs.writeFile(file, data, (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  });
};

const main = () => {
  glob(`${BUNDLE_DIR}/*.js`, {}, (er, files) => {
    for (let i = 0; i < files.length; i += 1) {
      removeEvals(files[i])
        .then(() => console.info(`Bundle ${files[i]}: OK`))
        .catch(console.error);
    }
  });
};

main();
