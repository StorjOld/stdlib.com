var Storj = require('../../deps/storj');
module.exports = (params, callback) => {
  if(!params.kwargs.bucketId) {
    return callback(new Error('bucketId required'));
  }
  var storj = new Storj(params.keys);
  storj.getBucket(params.kwargs.bucketId, callback);
};
