var mapper = require('object-mapper');

var userDto = user => mapper(user.get({ plain: true }), {
  username: "username"
})

var extendedUserDto = user => mapper(user.get({ plain: true }), {
  id: "id",
  username: "username"
})

module.exports = {
  userDto,
  extendedUserDto
}
