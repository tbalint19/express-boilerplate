var express = require('express')
var router = express.Router()

router.post('/upload', async (req, res) => {
  try {
    console.log("IN");
    console.log(req.files.file.name)
    console.log(req.files.file.size)
    req.files.file.mv('./uploaded/' + req.files.file.name)
  } catch (e) {
    console.log(e);
  }
  res.sendStatus(201)
})

module.exports = router
