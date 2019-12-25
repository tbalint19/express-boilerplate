const { exec } = require('child_process')
const fs = require('fs')

const { user, repo, tag } = require('./config.json')

const imageName = `${user}/${repo}:${tag}`

exec(`docker build . -t ${imageName}`, {}, () => {
  exec(`docker push ${imageName}`)
    .stdout.on('data', console.log)
})
.stdout.on('data', console.log)
