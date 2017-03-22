storj/lib
=========
_stdlib service_

![storj-stdlib](./img/storj-stdlib.png)

# Usage

The stdlib implementation of Storj attempts to keep as close to the [storj.js api](https://github.com/storj/storj.js) as possible. It is our hope that context switching between the two will a plesant experience.

```js
// You must obtain a private key and an encryption key from the storj-cli
const storj = require('lib').storj({ key, encryptionKey }).lib
storj.createBucket({ bucketName: 'Hello Future!' }, function(e, metadata) {
  if(e) {
    console.log(`Oh noes: ${ e.message }`);
  }
  console.log(`bucketId: ${metadata.id}`);
});
```

# `createBucket({ bucketName }, function cb(e, metadata) {})`

Create a bucket to store files in. Returns a `metadata` object of the form:

```js
{
  id: String, // bucketId
  name: String // name of the bucket
}
```

# `makePublic({ bucketId, perms }, function cb(e) {})`

Allow other users to use this bucket. `perms` is an array of permissions other users have for this bucket. Currently supported permissions are:

* `PULL`: Allow users to download files from this bucket
* `PUSH`: Allow users to upload files to this bucket

# `deleteBucket({ bucketId }, function cb(e) {})`

Remove a bucket.

# `getBucket({ bucketId }, function cb(e, metadata) {})`

Get the metadata for a bucket. `cb` will be invoked with a `metadata` object describing the bucket:

```js
{
  id: String, // The id of the bucket
  name: String // The name of the bucket
}
```

# `getBucketList(function cb(e, buckets) {})`

Get a list of all buckets associated with the currently authenticated account on the storj network. `cb` will be invoked with an array of meta-data about the buckets. Each element of the `buckets` array will have the following properties:

```js
{
  id: String, // the bucketID of the bucket
  name: String // the name of the bucket
}
```

# `createFile(fileContent, { bucketId, fileName }, function cb(e, metadata) {})`

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

# `getFile({ bucketId, fileId }, function cb(e, fileContent) {})`

Fetch a file from the Storj network. `fileContent` will be a `Buffer`.

# `getFileList({ bucketId }, function cb(e, files) {})`

Get a list of files stored in a bucket on the Storj network. `files` will be an array of meta-data about the files, each element will have the following properties:

```js
{
  id: String, // the id of the file
  name: String, // the name of the file
  mimetype: String // the mime-type of the file
}
```

# `deleteFile({ bucketId, fileId }, function cb(e) {})`

Remove a bucket.
