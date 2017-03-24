var Storj = require('../../deps/storj');
module.exports = (params, callback) => {
  if(!params.kwargs.publicKey) {
    return callback(new Error('publicKey required'));
  }
  var storj = new Storj(params.keys);
  storj.removeKey(params.kwargs.publicKey, callback);
};
