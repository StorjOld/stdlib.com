var Storj = require('../../deps/storj');
module.exports = (params, callback) => {
  if(!params.kwargs.bucketId) {
    return callback(new Error('bucketId required'));
  }
  if(!params.kwargs.perms) {
    return callback(new Error('perms required'));
  }
  var storj = new Storj(params.keys);
  storj.makePublic(params.kwargs.bucketId, params.kwargs.perms, callback);
};
