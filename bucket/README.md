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
