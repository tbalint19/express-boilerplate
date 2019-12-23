const { exec } = require('child_process')
const fs = require('fs')

const { user, repo, major, minor, patch } = require('./config.json')

const imageName = `${user}/${repo}:${major}.${minor}.${patch}`

exec(`docker build . -t ${imageName}`, {}, () => {
  fs.writeFileSync('CD/config.json', JSON.stringify({
    user, repo, major, minor, patch: patch+1
  }, undefined, 2))

  exec(`docker push ${imageName}`)
    .stdout.on('data', console.log)
})
.stdout.on('data', console.log)
