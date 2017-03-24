/* eslint-disable max-statements */
'use strict';

const test = require('tape');

const bucketName = `test-${Date.now()}-${(Math.random()+'').split('.')[1]}`;
let bucketId;
let fileId;
let key;
let encryptionKey;
let email = process.env.STORJ_EMAIL;
let password = process.env.STORJ_PASSWORD;
let env = `@${process.env.STDLIB_ENV}`;
const fileName = 'foobar.txt';
const fileContent = new Buffer(
  'IM A LUMBERJACK AND IM OK, I SLEEP ALL NIGHT AND I WORK ALL DAY'
);

let storj;

test('storj(basicAuth)', function(t) {
  storj = require('lib').storj({
    basicAuth: { email, password }
  });
  return t.end();
})

test('storj.keyPair.generate', function(t) {
  storj.keyPair[env].generate(function cb(e, keypair) {
    t.error(e, 'created keypair');
    if(e) { return t.end(); }
    t.ok(keypair.privateKey, 'keypair has private key');
    t.ok(keypair.publicKey, 'keypair has public key');
    key = keypair;
    return t.end();
  });
});

test('storj.keyPair.register', function(t) {
  var publicKey = key.publicKey
  storj.keyPair[env].register({ publicKey }, function(e) {
    t.error(e, 'registered new key');
    return t.end();
  });
});

test('storj.keyPair.list', function(t) {
  storj.keyPair[env].list(function cb(e, list) {
    t.error(e, 'fetched list of keys');
    if(e) { return t.end(); }
    for(var i = 0; i < list.length; i++) {
      console.log(list[i])
      if(list[i].key === key.publicKey) {
        t.pass('newly registered key listed');
        return t.end();
      }
    }
    t.fail('did not find newly registered key');
    return t.end();
  })
});

test('storj.encryptionKey.generate', function(t) {
  storj.encryptionKey[env].generate(function(e, key) {
    t.error(e, 'generated encryption key');
    encryptionKey = key.encryptionKey;
    console.log(key)
    return t.end();
  });
});

test('storj(keys)', function(t) {
  storj = require('lib').storj({
    key: key.privateKey,
    encryptionKey
  });
  return t.end();
});

test('storj.bucket.create', function(t) {
  storj.bucket[env].create({ bucketName }, function(e, meta) {
    t.error(e, 'createBucket returns success');
    if(e) { return t.end(); }
    t.ok(meta.id, 'gets bucket id back');
    t.equal(meta.name, bucketName, 'gets bucket name back');
    bucketId = meta.id;
    return t.end();
  });
});

test('storj.bucket.get', function(t) {
  storj.bucket[env].get({ bucketId }, function (e, bucket) {
    t.error(e, 'getBucket returns success');
    if(e) { return t.end(); }
    t.equal(bucket.id, bucketId, 'bucket has correct id');
    t.equal(bucket.name, bucketName, 'bucket has correct name');
    t.equal(bucket.files.length, 0, 'bucket has no files');
    return t.end();
  });
});

test('storj.bucket.list', function(t) {
  storj.bucket[env].list(function(e, buckets) {
    t.error(e, 'should successfully grab buckets');
    if(e) { return t.end(); }
    for(var i = 0; i < buckets.length; i++) {
      if(buckets[i].name === bucketName) {
        t.pass('newly created bucket listed');
        t.equal(buckets[i].id, bucketId, 'bucket has correct id');
        return t.end();
      }
    }
    t.fail('did not find newly created bucket');
    return t.end();
  });
});

test('storj.file.create', function(t) {
  storj.file[env].create(fileContent, { bucketId, fileName }, function (e, file) {
    t.error(e, 'successfully created file');
    if(e) { return t.end(); }
    t.equal(file.name, fileName, 'file.name attribute set');
    t.ok(file.id, 'file.id populated');
    t.equal(file.length, fileContent.length,
      'expect length to be length of fileContent');
    t.equal(file.mimetype, 'text/plain', 'expect .txt mimetype');
    fileId = file.id;
    return t.end();
  });
});

test('storj.file.list', function(t) {
  storj.file[env].list({ bucketId }, function(e, files) {
    t.error(e, 'fetch file list successfully');
    if(e) { return t.end(); }
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

test('storj.file.get', function(t) {
  storj.file[env].get({ bucketId, fileId }, function(e, file) {
    t.error(e, 'retreived file contents');
    if(e) { return t.end(); }
    t.equal(file.toString(), fileContent.toString(), 'content correct');
    return t.end();
  })
});

test('storj.bucket.makePublic', function(t) {
  var opts = { bucketId, perms: ['PUSH', 'PULL'] }
  storj.bucket[env].makePublic(opts, function(e) {
    t.error(e, 'make public successful');
    if(e) { return t.end(); }
    return t.end();
  })
});

test('storj.file.delete', function(t) {
  storj.file[env].delete({ bucketId, fileId }, function (e) {
    t.error(e, 'removed file');
    if(e) { return t.end(); }
    return t.end();
  });
});

test('storj.file.list', function(t) {
  storj.file[env].list( { bucketId }, function(e, files) {
    t.error(e, 'fetch file list successfully');
    if(e) { return t.end(); }
    for(var i = 0; i < files.length; i++) {
      if(files[i].filename === fileName) {
        t.fail('file remained after delete');
        return t.end();
      }
    }
    t.pass('file removed');
    return t.end();
  });
});

test('storj.bucket.delete', function(t) {
  storj.bucket[env].delete({ bucketId }, function (e) {
    t.error(e, 'successfully delete bucket');
    if(e) { return t.end(); }
    return t.end();
  });
});

test('storj.bucket.list', function(t) {
  storj.bucket[env].list(function(e, buckets) {
    t.error(e, 'should successfully grab buckets');
    if(e) { return t.end(); }
    for(var i = 0; i < buckets.length; i++) {
      if(buckets[i].name === bucketName) {
        t.fail('bucket still listed');
        bucketId = buckets[i].id;
        return t.end();
      }
    }
    t.pass('bucket removed after delete');
    return t.end();
  });
});

test('storj.keyPair.delete', function(t) {
  storj.keyPair[env].delete(key.publicKey, function(e) {
    t.error(e, 'removed key');
    return t.end();
  });
});
