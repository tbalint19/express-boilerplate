# ExpressJS boilerplate app

## Features
- Sequlize ORM
- Prometheus middleware (metrics)
- Morgan JSON logger
- Google OpenID authentication
- Auth models (user, role, permission)
- Unit & Integration tests (with jest)
- Axios http client
- Prettier format
- CI/CD

## Requirements
- node
- npm
- git
- docker

## Setup checklist

1. _Setup app for local npm start_
  - rename app folder
  - duplicate @config/test.js as @config/development.js
  - install dependencies
  - rename project in package.json (+author, description)

  ```bash
  mv express-boilerplate backend
  cd backend
  cp config/test.js config/development.js
  npm i
  npm start
  ```

  __-> APP is ready to run locally__

2.  _Setup git_
  - Setup an account at [github](https://github.io)
  - remove current .git folder
  - rename project in package.json (+author, description)
  - git add, commit, create repo, push...

  __-> code is versioned locally and remote__

3. _Setup dev env - out-of-the-box working_
  - Run code format
  - Run existing unit tests
  - Run existing integration tests

  ```bash
  npm run format
  npm run format-check
  npm run test:unit
  npm run test:integration
  ```

4. _Setup dev env -  sonar config_
  - Setup an account at [sonarcloud](https://sonarcloud.io)
  - Edit @/CI/sonar/config.json
  - sonar.organization is your username
  - sonar.projectKey is user_name-of-your-choice
  - sonar.login: [Avatar] -> My account -> Security -> Generate
  - gitgnore if needed (and use private sonar as well, if sensitive)

  ```bash
  npm sonar-check

  # and all quality checks together
  npm run ci
  ```

  __-> App can be extended in a safe manner__

5. _Setup githook_
  - Setup an account at [github](https://github.io)
  - remove current .git folder
  - git add, commit, create repo, push...
  - add githook for before push - .git/hooks folder

  ```bash
  #!/usr/bin/env bash
  npm run ci
  ```

  __-> Before all remote save the quality of the code is checked__

6. _Setup docker_
  - Setup an account at [dockerhub](https://hub.docker.com)
  - Edit @/CD/config.json
  - user is your dockerhub username
  - repo is the name of the project (whatever you choose)
  - tag is latest by default, automated versioning the images is not implemented here

  ```bash
  npm run cd
  ```

  __-> Releases are kept as images on docker hub__

7. _Setup host - sloppy.io_
  - backend
  - database - [set container as host on admin for env var](https://kb.sloppy.io/en/articles/1346435-setting-up-postgresql-and-adminer-on-sloppy-io)

8. _Setup openID connect with google_
  - [Complete step 1, 2, 3 >>>](https://developers.google.com/identity/protocols/OpenIDConnect)
  - update client_ID, client_secret and redirect_uri (can be anything for now) in @config/production.js (and in other envs if needed)

  __-> OpenID works on the backed__
