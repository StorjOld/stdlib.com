var Storj = require('../../deps/storj');
module.exports = (params, callback) => {
  return callback(null, { 'encryptionKey': Storj.generateEncryptionKey() });
};
