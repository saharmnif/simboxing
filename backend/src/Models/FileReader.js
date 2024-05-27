// const fs = require('fs');

// class FileReader {
//   constructor() {}

//   // Fonction récursive pour obtenir les fichiers
//   static getFiles(dir, files = []) {
//     const fileList = fs.readdirSync(dir);
//     for (const file of fileList) {
//       const name = `${dir}/${file}`;
//       if (fs.statSync(name).isDirectory()) {
//         FileReader.getFiles(name, files);
//       } else {
//         files.push(name);
//       }
//     }
//     return files;
//   }
// }

// module.exports = FileReader;
