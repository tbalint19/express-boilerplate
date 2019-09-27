const authorize = (isAuthorized) => {
  if (!isAuthorized)
    throw {
      status: 403,
      message: 'Unauthorized by auth middleware',
    }
}

module.exports = {
  authorize
}
