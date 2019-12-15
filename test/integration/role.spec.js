const { newDb, database, clearDb } = require('./util/db.js')
const {
  programaticallyPreassingRoot,
  login,
} = require('./user-actions/user-endpoint')

const { assignAdminRole } = require('./user-actions/role-endpoint')

describe('User endpoint tests', () => {
  beforeAll(() => newDb())
  beforeEach(() => clearDb())

  it('should preassign admin role as root', async () => {
    // given
    await programaticallyPreassingRoot('rootUser@company.hu')
    const sessionToken = await login({
      googleId: '1',
      email: 'rootUser@company.hu',
    })

    // when
    const response = await assignAdminRole({
      as: sessionToken,
      to: 'randomUser@company.hu',
    })

    // then
    const users = await database.User.findAll()
    expect(users).toHaveLength(1)

    const roles = await database.Role.findAll()
    expect(roles).toHaveLength(2)
  })

  test.todo('should not preassign admin role unauthenticated')

  test.todo('should not change root role to admin')
})
