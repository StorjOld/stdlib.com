var Storj = require('../../deps/storj');
module.exports = (params, callback) => {
  if(!params.kwargs.bucketId) {
    return callback(new Error('bucketId required'));
  }
  var storj = new Storj(params.keys);
  storj.deleteBucket(params.kwargs.bucketId, function(e) {
    return callback(e, {});
  });
};
