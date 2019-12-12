const express = require('express')
const router = express.Router()
const { getSummary, getContentType } = require('@promster/express')

router.get('/metrics', (req, res) => {
  req.statusCode = 200
  res.setHeader('Content-Type', getContentType())
  res.end(getSummary())
})

module.exports = router
