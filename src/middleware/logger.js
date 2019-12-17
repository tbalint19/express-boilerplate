const morgan = require('morgan')
const os = require('os')
const fs = require('fs')
const path = require('path')
const rfs = require('rotating-file-stream')

morgan.token('hostname', function getHostname() {
  return os.hostname()
})
morgan.token('pid', function getPid() {
  return process.pid
})

function jsonFormat(tokens, req, res) {
  return JSON.stringify({
    'remote-address': tokens['remote-addr'](req, res),
    time: tokens['date'](req, res, 'iso'),
    method: tokens['method'](req, res),
    url: tokens['url'](req, res),
    'http-version': tokens['http-version'](req, res),
    'status-code': tokens['status'](req, res),
    'content-length': tokens['res'](req, res, 'content-length'),
    referrer: tokens['referrer'](req, res),
    'user-agent': tokens['user-agent'](req, res),
    hostname: tokens['hostname'](req, res),
    pid: tokens['pid'](req, res),
  })
}

const loggerMiddlerware = function logger({ persist }) {
  const options = persist
    ? {
        stream: rfs('access.log', {
          interval: '1d',
          path: path.join(__dirname, '../../log'),
        }),
      }
    : {}
  return morgan(jsonFormat, options)
}

const skippedLogger = () => (req, res, next) => next()

module.exports =
  process.env.NODE_ENV !== 'test' ? loggerMiddlerware : skippedLogger
