# @ovalcms/backend-node

[![N|OvalCMS](https://www.ovalcms.com/assets/img/logo.png)](https://www.ovalcms.com)

Example backend node server to read from the OvalCMS API and respond to a given frontend client. 

# Features!

  - Uses OAuth2 for secure retrieval of content from the OvalCMS API
  - Hides CLIENT_ID, CLIENT_SECRET, and ACCESS_TOKEN from frontend client
  - Sample tests included for retrieval of ACCESS_TOKEN and content
  - ACCESS_TOKEN cached to reduce resource calls
  - Responses provided in JSON format

## Install

```
$ npm install @ovalcms/backend-node
```

## Environment Variables

Create a file name ".env" in the root directory

```
NODE_ENV=production
LOCAL_PORT=80
API_PROTOCOL=https
API_HOST=api.ovalcms.com
API_PORT=80
OVAL_CLIENT_ID= [ from your OvalCMS.com account ]
OVAL_CLIENT_SECRET= [ from your OvalCMS.com account ]
```

## Usage

Install the dependencies and devDependencies and start the server.

```sh
$ cd node-client-backend
$ npm install
$ npm run start
```

## Test and Coverage

The "coverage" command include call to run the tests. Afterwards a new folder named "coverage" will be created. Open the following file in a web browser: backend-node\coverage\index.html 

```sh
$ cd backend-node
$ npm run coverage
```

License
----
MIT