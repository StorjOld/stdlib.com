var Storj = require('../../deps/storj');
module.exports = (params, callback) => {
  var storj = new Storj(params.keys);
  storj.removeKey(publicKey, callback);
};
