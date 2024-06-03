const path = require('path');

module.exports = {
  // Autres configurations webpack

  resolve: {
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "fs": false, // Par exemple, vous n'avez peut-être pas besoin d'un polyfill pour fs
      "crypto": require.resolve("crypto-browserify"),
      // Ajoutez d'autres modules manquants ici avec leurs polyfills respectifs
    }
  }
};