const app = require('../../../src/app.js')
const request = require('supertest')

const assignAdminRole = async ({ as, to }) => {
  const response = await request(app)
    .post('/api/role/admin')
    .set('Authorization', as)
    .send({ email: to })
  return response
}

module.exports = {
  assignAdminRole,
}
