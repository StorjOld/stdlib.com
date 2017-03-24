# Installing packages

The top level package.json is responsible for installing all dependencies. stdlib is unable to handle an `npm install` that declares git dependencies. Since storj.js has git dependencies, we have to hack together our dependency tree.

In the top level directory, run `npm install` which will clone our single dep (`storj.js`) into a directory called `./deps` and do and will install all of its dependencies. This directory then will be copied into each of the services directories so they will be uploaded alongside our codebases.

# Tests

Our tests are integration tests that will run against a real stdlib deployment.

`npm test` will handle installing all of the test's dependencies and kicking off the test. The tests expect the following environment variables:

* `STORJ_EMAIL`: email address for the storj account we will run the tests against
* `STORJ_PASSWORD`: password for the storj account
* `STDLIB_ENV`: What deployment are we targeting? (i.e. `dev` vs `release`)

Before testing, it might be handy to run this quick script to upload all of your recent changes to stdlib's dev environment:

```
find . -maxdepth 1 -mindepth 1 -type d | grep -v 'deps\|test' | xargs -I{} bash -c 'cd {} && lib up dev'
```
