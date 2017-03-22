/* eslint-disable max-statements */
'use strict';

const test = require('tape');

const bucketName = `test-${Date.now()}-${(Math.random()+'').split('.')[1]}`;
let bucketId;
let fileId;
let key = process.env.STORJ_KEY;
let encryptionKey = process.env.STORJ_ENCRYPT_KEY;
const fileName = 'foobar.txt';
const fileContent = new Buffer(
  'IM A LUMBERJACK AND IM OK, I SLEEP ALL NIGHT AND I WORK ALL DAY'
);

var storj = require('lib').retrohacker({ key, encryptionKey }).storj['@dev']

test('createBucket', function(t) {
  storj.createBucket({ bucketName }, function(e, meta) {
    t.error(e, 'createBucket returns success');
    if(e) return t.end();
    t.ok(meta.id, 'gets bucket id back');
    t.equal(meta.name, bucketName, 'gets bucket name back');
    bucketId = meta.id;
    t.end();
  });
});

test('getBucket', function(t) {
  storj.getBucket({ bucketId }, function (e, bucket) {
    t.error(e, 'getBucket returns success');
    if(e) return t.end();
    t.equal(bucket.id, bucketId, 'bucket has correct id');
    t.equal(bucket.name, bucketName, 'bucket has correct name');
    t.equal(bucket.files.length, 0, 'bucket has no files');
    t.end();
  });
});

test('getBucketList', function(t) {
  storj.getBucketList(function(e, buckets) {
    t.error(e, 'should successfully grab buckets');
    if(e) return t.end();
    for(var i = 0; i < buckets.length; i++) {
      if(buckets[i].name === bucketName) {
        t.pass('newly created bucket listed');
        t.equal(buckets[i].id, bucketId, 'bucket has correct id');
        return t.end();
      }
    }
    t.fail('did not find newly created bucket');
    t.end();
  });
});

test('createFile', function(t) {
  storj.createFile(fileContent, { bucketId, fileName }, function (e, file) {
    t.error(e, 'successfully created file');
    if(e) return t.end();
    t.equal(file.name, fileName, 'file.name attribute set');
    t.ok(file.id, 'file.id populated');
    t.equal(file.length, fileContent.length,
      'expect length to be length of fileContent');
    t.equal(file.mimetype, 'text/plain', 'expect .txt mimetype');
    fileId = file.id;
    t.end();
  });
});

test('getFileList', function(t) {
  storj.getFileList({ bucketId }, function(e, files) {
    t.error(e, 'fetch file list successfully');
    if(e) return t.end();
    for(var i = 0; i < files.length; i++) {
      if(files[i].filename === fileName) {
        t.equal('text/plain', files[i].mimetype, 'correct mimetype set')
        return t.end();
      }
    }
    t.fail('did not find file in bucket');
    return t.end();
  });
});

test('getFile', function(t) {
  storj.getFile({ bucketId, fileId }, function(e, file) {
    t.error(e, 'retreived file contents');
    if(e) return t.end();
    t.equal(file.toString(), fileContent.toString(), 'content correct');
    t.end();
  })
});

test('makePublic', function(t) {
  storj.makePublic( { bucketId, perms: ['PUSH', 'PULL'] }, function(e) {
    t.error(e, 'make public successful');
    if(e) return t.end();
    t.end();
  })
});

test('deleteFile', function(t) {
  storj.deleteFile({ bucketId, fileId }, function (e) {
    t.error(e, 'removed file');
    if(e) return t.end();
    t.end();
  });
});

test('getFileList', function(t) {
  storj.getFileList( { bucketId }, function(e, files) {
    t.error(e, 'fetch file list successfully');
    if(e) return t.end();
    for(var i = 0; i < files.length; i++) {
      if(files[i].filename === fileName) {
        t.fail('file remained after delete');
      }
    }
    t.pass('file removed');
    return t.end();
  });
});

test('deleteBucket', function(t) {
  storj.deleteBucket({ bucketId }, function (e) {
    t.error(e, 'successfully delete bucket');
    if(e) return t.end();
    t.end();
  });
});

test('getBucketList', function(t) {
  storj.getBucketList(function(e, buckets) {
    t.error(e, 'should successfully grab buckets');
    if(e) return t.end();
    for(var i = 0; i < buckets.length; i++) {
      if(buckets[i].name === bucketName) {
        t.fail('bucket still listed');
        bucketId = buckets[i].id;
        return t.end();
      }
    }
    t.pass('bucket removed after delete');
    t.end();
  });
});
