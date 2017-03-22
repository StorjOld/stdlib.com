require('../../deps/storj/node_modules/longjohn');
var Storj = require('../../deps/storj');
module.exports = (params, callback) => {
  if(!params.kwargs.bucketId) {
    return callback(new Error('bucketId required'));
  }
  if(!params.kwargs.fileId) {
    return callback(new Error('fileId required'));
  }

  var storj = new Storj(params.keys);
  storj.deleteFile(params.kwargs.bucketId, params.kwargs.fileId, function(e) {
    return callback(e, {});
  });
};
