/* eslint-disable no-empty */
/* eslint-disable consistent-return */
const path = require('path');
const fs = require('fs');

const data = [];

function scanDirs(directoryPath) {
  try {
    const ls = fs.readdirSync(directoryPath);

    for (let index = 0; index < ls.length; index += 1) {
      const file = path.join(directoryPath, ls[index]);
      let dataFile = null;
      try {
        dataFile = fs.lstatSync(file);
      } catch (e) {}

      if (dataFile) {
        if (dataFile.isDirectory()) {
          scanDirs(file);
        } else {
          data.push({
            path: `./${file.replace('.js', '')}`,
          });
        }
      }
    }
    return data;
  } catch (e) {
    return e;
  }
}
module.exports = scanDirs;
