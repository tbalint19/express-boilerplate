module.exports = (isAuthorized) => {
  if (!isAuthorized) throw ({
    status: 403,
    message: "Unauthorized by auth middleware"
  })
}
