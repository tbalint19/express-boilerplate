var errorHandler = (app) => (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
}

module.exports = errorHandler
