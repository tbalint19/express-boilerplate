var mapper = require('object-mapper');

var userDto = user => mapper(user, {
  username: "username"
})

var extendedUserDto = user => mapper(user, {
  id: "id",
  username: "username",
})

module.exports = {
  userDto,
  extendedUserDto
}
