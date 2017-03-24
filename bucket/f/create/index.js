var Storj = require('../../deps/storj');
module.exports = (params, callback) => {
  if(!params.kwargs.bucketName) {
    return callback(new Error('bucketName required'));
  }
  var storj = new Storj(params.keys);
  storj.createBucket(params.kwargs.bucketName, callback);
};
