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

  __-> App is ready to run locally__

2.  _Setup git_
  - Setup an account at [github](https://github.io)
  - (Shell github login is required)
  - remove current .git folder
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
  - Connect to your github account
  - Add your project from github: [+] -> Analyze new project -> Github app configuration -> Sonarcloud [Configure] -> Select repositories -> Save
  - Edit @/CI/sonar/config.json
  - sonar.organization is your username
  - sonar.projectKey is user_github-project-name
  - sonar.login: [Avatar] -> My account -> Security -> Generate
  - gitignore if needed (and use private sonar as well, if sensitive)

  ```bash
  npm sonar-check

  # and all quality checks together
  npm run ci
  ```

  __-> App can be extended in a safe manner__

5. _Setup githook_
  - create githook for before push - .git/hooks folder
  - delete the file extension for pre-push.sample (".sample")
  - in the pre-push file (only this, delete what is currently there):

  ```bash
  #!/bin/sh
  npm run ci
  ```

  __-> Before all remote save the quality of the code is checked__

6. _Setup docker_
  - Setup an account at [dockerhub](https://hub.docker.com)
  - (Shell docker login is required)
  - Edit @/CD/config.json
  - user is your dockerhub username
  - repo is the name of the project (whatever you choose)
  - tag is latest by default, automated versioning the images is not implemented here

  ```bash
  npm run cd
  ```

  __-> Releases are kept as images on docker hub__

7. _Setup host - sloppy.io_
  - Setup an account at [sloppy.io](https://admin.sloppy.io/)
  - Create a project, name it, name the service, and add to app
  - First the database - [set container as host on admin for env var](https://kb.sloppy.io/en/articles/1346435-setting-up-postgresql-and-adminer-on-sloppy-io)
  - Then with [Add app], select the image, set the env vars...

  __-> App is on the internet__

8. _Setup openID connect with google_
  - Select project -> [New project](https://console.developers.google.com/)
  - Oauth consent screen -> external
  - Application name, authorized domains (.sloppy.zone)
  - Credentials -[+ Create credentials] (Oauth2) -> Web app, set name & redirect uri (localhost or authorized domain) -> client_ID & client_secret
  - update client_ID, client_secret and redirect_uri (can be anything for now) in @config/production.js (and in other envs if needed)
  - Full guide(https://developers.google.com/identity/protocols/OpenIDConnect)

  __-> OpenID works on the backed__
