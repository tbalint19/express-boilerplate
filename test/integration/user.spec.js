const { newDb, models, clearDb } = require('./util/db.js')
const {
  programaticallyPreassingRoot,
  login,
  loginWithoutAuthentication,
  loginWithoutAuthCode,
  blacklistUser,
  whitelistUser,
} = require('./user-actions/user-endpoint')
const { assignAdminRole } = require('./user-actions/role-endpoint')

const { parse } = require('../../src/utils/jwt.js')

describe('User endpoint tests', () => {
  beforeAll(() => newDb())
  beforeEach(() => clearDb())

  it('should not login user authorization code is not sent', async () => {
    // given

    // when
    const response = await loginWithoutAuthCode()

    // then
    expect(response.status).toBe(422)
    expect(response.body).toEqual({
      errors: [
        {
          msg: 'Invalid value',
          param: 'authorizationCode',
          location: 'body',
        },
      ],
    })
  })

  it('should not login without google auth', async () => {
    // given

    // when
    const response = await loginWithoutAuthentication()

    // then
    expect(response.status).toBe(401)
  })

  it('should login as user without preassigned role', async () => {
    // given

    // when
    const sessionToken = await login({
      googleId: '1',
      email: 'randomUser@company.hu',
    })

    // then
    const sessionData = parse(sessionToken)
    expect(sessionData.googleId).toBe('1')
    expect(sessionData.email).toBe('randomUser@company.hu')
    expect(sessionData.role.name).toBe('USER')

    const users = await models.User.findAll()
    expect(users).toHaveLength(1)
  })

  it('should not create new user when email is changed, but change the email', async () => {
    // given
    await login({
      googleId: '1',
      email: 'randomUser@company.hu',
    })

    // when
    const sessionToken = await login({
      googleId: '1',
      email: 'rootUser@company.hu',
    })

    // then
    const sessionData = parse(sessionToken)
    expect(sessionData.googleId).toBe('1')
    expect(sessionData.email).toBe('rootUser@company.hu')
    expect(sessionData.role.name).toBe('USER')

    const users = await models.User.findAll()
    expect(users).toHaveLength(1)
    expect(users[0].email).toBe('rootUser@company.hu')
  })

  it('should login as root with programatically preassigned root role', async () => {
    // given
    await programaticallyPreassingRoot('rootUser@company.hu')

    // when
    const sessionToken = await login({
      googleId: '1',
      email: 'rootUser@company.hu',
    })

    // then
    const sessionData = parse(sessionToken)
    expect(sessionData.googleId).toBe('1')
    expect(sessionData.email).toBe('rootUser@company.hu')
    expect(sessionData.role.name).toBe('ROOT')
  })

  test.each([['USER', 'ADMIN'], ['USER', 'ROOT'], ['ADMIN', 'ROOT']])(
    'should blacklist %s as %s',
    async (target, as) => {
      // given
      const users = {
        USER: { email: 'randomUser@company.hu' },
        ADMIN: { email: 'adminUser@company.hu' },
        ROOT: { email: 'rootUser@company.hu' },
      }

      await programaticallyPreassingRoot(users['ROOT'].email)
      users['ROOT'].token = await login({
        googleId: '1',
        email: users['ROOT'].email,
      })
      await assignAdminRole({
        as: users['ROOT'].token,
        to: users['ADMIN'].email,
      })
      users['ADMIN'].token = await login({
        googleId: '2',
        email: users['ADMIN'].email,
      })
      users['USER'].token = await login({
        googleId: '3',
        email: users['USER'].email,
      })

      // when
      const response = await blacklistUser({
        as: users[as].token,
        email: users[target].email,
      })

      // then
      expect(response.status).toBe(204)

      const blacklistedUser = await models.User.findOne({
        where: { email: users[target].email },
      })
      expect(blacklistedUser.isBlacklisted).toBe(true)
    }
  )

  it('should whitelist user as root', async () => {
    // given
    await programaticallyPreassingRoot('rootUser@company.hu')
    await login({ googleId: '2', email: 'randomUser@company.hu' })
    const sessionToken = await login({
      googleId: '1',
      email: 'rootUser@company.hu',
    })
    await blacklistUser({ as: sessionToken, email: 'randomUser@company.hu' })

    // when
    const response = await whitelistUser({
      as: sessionToken,
      email: 'randomUser@company.hu',
    })

    // then
    const users = await models.User.findAll()
    expect(users).toHaveLength(2)

    const blacklistedUser = await models.User.findOne({
      where: { email: 'randomUser@company.hu' },
    })
    expect(blacklistedUser.isBlacklisted).toBe(false)
  })

  it('should not login user when blacklisted', async () => {
    // given
    await login({
      googleId: '2',
      email: 'randomUser@company.hu',
    })

    await programaticallyPreassingRoot('rootUser@company.hu')
    const rootUserToken = await login({
      googleId: '1',
      email: 'rootUser@company.hu',
    })
    await blacklistUser({
      as: rootUserToken,
      email: 'randomUser@company.hu',
    })

    // when
    const sessionToken = await login({
      googleId: '2',
      email: 'randomUser@company.hu',
    })

    // then
    expect(sessionToken).toBe(undefined)
  })
})
