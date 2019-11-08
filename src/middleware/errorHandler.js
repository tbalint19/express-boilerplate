const getStatus = (err) => {
  if (err.status) return err.status
  else if (err.name && err.name === 'SequelizeValidationError') return 400
  // ...
  else return 500
}

const getContent = (err) => {
  let data = {}
  data.message = err.message
  if (process.env.NODE_ENV !== 'production') data.error = err
  return data
}

const errorHandler = (err, req, res, next) => {
  res.status(getStatus(err))
  res.json(getContent(err))
}

module.exports = errorHandler
