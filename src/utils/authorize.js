const authorize = (
  isAuthorized,
  message = 'Unauthorized by auth middleware'
) => {
  if (!isAuthorized)
    throw {
      status: 403,
      message,
    }
}

module.exports = {
  authorize,
}
