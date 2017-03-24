var Storj = require('../../deps/storj');
module.exports = (params, callback) => {
  var storj = new Storj(params.keys);
  var keyPair = storj.generateKeyPair();
  return callback(null, {
    publicKey: keyPair.getPublicKey(),
    privateKey: keyPair.getPrivateKey()
  });
};
