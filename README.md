# @ovalcms/backend-node

[![N|OvalCMS](https://www.ovalcms.com/assets/img/logo.png)](https://www.ovalcms.com)

Example backend node server to read from the OvalCMS API and respond to a given frontend client. 

[![N|OvalCMS](https://www.ovalcms.com/assets/img/examples/ovalCmsDgrmCstmrBackEnd729.png)](https://www.ovalcms.com)

# Features!

  - Uses OAuth2 for secure retrieval of content from the OvalCMS API
  - Uses Redis for caching of token object (works on system reboot/restart also)
  - Hides CLIENT_ID, CLIENT_SECRET, and ACCESS_TOKEN from frontend client
  - Sample tests included for retrieval of ACCESS_TOKEN and content
  - ACCESS_TOKEN cached to reduce resource calls
  - Responses provided in JSON format

## Download The Example

```
# clone the repo
$ git clone https://github.com/ovalcms/backend-node.git
```

## Environment Variables

Create a file name ".env" in the root directory

```
NODE_ENV=production
LOCAL_PORT=5000
API_PROTOCOL=https
API_HOST=api.ovalcms.com
OVAL_CLIENT_ID= [ from your OvalCMS.com account ]
OVAL_CLIENT_SECRET= [ from your OvalCMS.com account ]
```

## Install Redis Server
This example uses Redis for token caching. If you use a diifferent method feel frre to use that. However, it is important to use a caching method that will keep cache or token after a server reboot/restart.

osx / *nix
```sh
$ brew update
$ brew upgrade
$ brew install redis
$ redis-server /usr/local/etc/redis.conf
```

## Usage

Install the dependencies and devDependencies and start the server.

```sh
$ cd backend-node
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
[MIT License](LICENSE) Copyright (c) 2019 [OvalCMS](https://www.ovalcms.com/).