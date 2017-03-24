var Storj = require('../../deps/storj');
module.exports = (params, callback) => {
  if(!params.kwargs.bucketId) {
    return callback(new Error('bucketId required'));
  }
  if(!params.kwargs.fileName) {
    return callback(new Error('fileName required'));
  }
  if(!params.buffer) {
    return callback(new Error('Buffer required'));
  }

  var storj = new Storj(params.keys);
  var { bucketId, fileName } = params.kwargs;
  var fileSize = params.buffer.length;
  var rs = new stream.Readable();
  rs._read = function () {};
  rs.push(params.buffer);
  rs.push(null);
  var file = storj.createFile(bucketId, fileName, rs, { fileSize },
    (meta) => callback(null, file));
  file.on('error', callback);
};
