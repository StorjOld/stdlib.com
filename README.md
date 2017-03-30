require('lib').storj
====================

![storj-stdlib](http://i.imgur.com/yVPR6Bi.png)

# Usage

The stdlib implementation of Storj attempts to keep as close to the [storj.js api](https://github.com/storj/storj.js) as possible. It is our hope that context switching between the two will a plesant experience.

```js
const storj = require('lib').storj({ key, encryptionKey })
storj.bucket.create({ bucketName: 'Hello Future!' }, function(e, metadata) {
  if(e) {
    console.log(`Oh noes: ${ e.message }`);
  }
  console.log(`bucketId: ${metadata.id}`);
});
```

# API

### `storj.keyPair.generate(function cb(e, keypair) {})`

Generate a new private/public keypair that can be used to authenticate on the network. The returned keypair will be of the form:

```js
{
  publicKey: String,
  privateKey: String
}
```

### `storj.keyPair.register({ publicKey }, function cb(e) {})`

Register a public key to your account, giving the key holder admin rights to the account.

### `storj.keyPair.delete({ publicKey }, function cb(e) {})`

Remove a public key from your account.

### `storj.keyPair.list(function cb(e) {})`

List all public keys registered to your account.

### `storj.bucket.create({ bucketName }, function cb(e, metadata) {})`

Create a bucket to store files in. Returns a `metadata` object of the form:

```js
{
  id: String, // bucketId
  name: String // name of the bucket
}
```

### `storj.bucket.makePublic({ bucketId, perms }, function cb(e) {})`

Allow other users to use this bucket. `perms` is an array of permissions other users have for this bucket. Currently supported permissions are:

* `PULL`: Allow users to download files from this bucket
* `PUSH`: Allow users to upload files to this bucket

### `storj.bucket.delete({ bucketId }, function cb(e) {})`

Remove a bucket.

### `storj.bucket.get({ bucketId }, function cb(e, metadata) {})`

Get the metadata for a bucket. `cb` will be invoked with a `metadata` object describing the bucket:

```js
{
  id: String, // The id of the bucket
  name: String // The name of the bucket
}
```

### `storj.bucket.list(function cb(e, buckets) {})`

Get a list of all buckets associated with the currently authenticated account on the storj network. `cb` will be invoked with an array of meta-data about the buckets. Each element of the `buckets` array will have the following properties:

```js
{
  id: String, // the bucketID of the bucket
  name: String // the name of the bucket
}
```

### `storj.file.create(fileContent, { bucketId, fileName }, function cb(e, metadata) {})`

`fileContent` should be a `Buffer`, `bucketId` is the id as returned by `createBucket`, and `fileName` is the desired name for the uploaded file. Then callback will be invoked with a `metadata` object describing the file:

```js
{
  id: String, // fileId
  name: String, // file name
  length: Number, // size of the file in bytes
  mimetype: String // mimetype of the file
}
```

> Note: the returned name may not match the desired name in rare cases. If you try to upload a file using a name that already exists, a new name will be generated for you.

### `storj.file.get({ bucketId, fileId }, function cb(e, fileContent) {})`

Fetch a file from the Storj network. `fileContent` will be a `Buffer`.

### `storj.file.list({ bucketId }, function cb(e, files) {})`

Get a list of files stored in a bucket on the Storj network. `files` will be an array of meta-data about the files, each element will have the following properties:

```js
{
  id: String, // the id of the file
  name: String, // the name of the file
  mimetype: String // the mime-type of the file
}
```

### `storj.file.delete({ bucketId, fileId }, function cb(e) {})`

Remove a file.

# Examples

## Get a key pair and encryption key

After [signing up for Storj](https://app.storj.io/#/signup), you will have an email and password that you can use for logging into your account. While usernames and passwords work great for humans, they are insecure when used in your applications.

For greater security, Storj allows you to create a private/public keypair which can be added and removed from any account. This means if your keypair gets leaked, you can revoke access to that key without worrying about resetting passwords etc.

Likewise, when uploading a file to the network, it will be encrypted with what is called an encryption key. This means you can maintain fine-grained access to files on the Storj network by managing multiple encryption keys, and that if your username/password or keypair are leaked, your files are still safe from prying eyes.

To create these for one of your services using the storj stdlib services, simply run this script:

```js
var lib = require('lib');
var storj;

function generateKeyPair(cb) {
  storj.keyPair.generate(function (e, keyPair) {
    if(e) { return cb(e); }
    return registerKeyPair(keyPair, cb);
  });
}

function registerKeyPair(keyPair, cb) {
  storj.keyPair.register({ publicKey: keyPair.publicKey }, function (e) {
    if(e) { return cb(e); }
    return generateEncryptionKey(keyPair, cb)
  });
}

function generateEncryptionKey(keyPair, cb) {
  storj.encryptionKey.generate(function (e, encryptionKey) {
    if(e) { return cb(e); }
    return cb(null, keyPair, encryptionKey.encryptionKey);
  });
}

var email = 'example@gmail.com';
var password = 'supersecretpassword';
storj = lib.storj({ basicAuth: { email, password } });
generateKeyPair(function(e, keyPair, encryptionKey) {
  if(e) { return console.log(e) };
  console.log(`Public key: ${keyPair.publicKey}`);
  console.log(`Private key: ${keyPair.privateKey}`);
  console.log(`Encryption key: ${encryptionKey}`);
});
```

> Note: You only need to run this script once. Once you have these values, you should store them in a safe place, and provide them to your services instead of using your email and password.

To play with this example in an interactive playground, visit: https://runkit.com/wblankenship/storj-stdlib-keypair

## Upload a file

Once you have an encryption key and a private/public key, you are ready to start uploading data to the network, which happens to be incredibly easy!

```js
var lib = require('lib');

function createBucket(cb) {
  // Create a bucket to put files in
  storj.bucket.create({ bucketName: 'foobar' }, function(e, meta) {
    if(e) { return cb(e); }
    return createFile(meta.id, cb);
  });
}

function createFile(bucketId, cb) {
  // Put files in the bucket!
  var fileName = 'buzzbazz.txt';
  var fileContent = new Buffer('hello storj!');
  storj.file.create(fileContent, { fileName, bucketId }, function (e, meta) {
    if(e) { return cb(e); }
    return cb(null, { fileId: meta.id, bucketId });
  });
}

var key = '[PRIVATE_KEY]';
var encryptionKey = '[ENCRYPTION_KEY]';
var storj = lib.storj({ key, encryptionKey })
createBucket(function(e, meta) {
  if(e) { return console.log(e) };
  console.log(`Created file ${meta.fileId} in bucket ${meta.bucketId}`);
});
```

To play with this example in an interactive playground, visit: https://runkit.com/wblankenship/storj-stdlib-upload
