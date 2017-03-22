var Storj = require('../../deps/storj');
module.exports = (params, callback) => {
  if(!params.kwargs.bucketId) {
    return callback(new Error('bucketId required'));
  }
  if(!params.kwargs.fileId) {
    return callback(new Error('fileId required'));
  }

  var storj = new Storj(params.keys);
  var { bucketId, fileId } = params.kwargs;
  var file = storj.getFile(bucketId, fileId, () => file.getBuffer(callback));
  file.on('error', callback);
};
