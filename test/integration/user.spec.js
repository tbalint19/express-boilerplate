const { newDb, database, clearDb } = require('./util/db.js')
const {
  programaticallyPreassingRoot,
  login,
  blacklistUser,
  whitelistUser,
} = require('./user-actions/user-endpoint')

const { parse } = require('../../src/utils/jwt.js')

describe('User endpoint tests', () => {
  beforeAll(() => newDb())
  beforeEach(() => clearDb())

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

    const users = await database.User.findAll()
    expect(users).toHaveLength(1)
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

  it('should blacklist user as root', async () => {
    // given
    await programaticallyPreassingRoot('rootUser@company.hu')
    await login({ googleId: '2', email: 'randomUser@company.hu' })
    const sessionToken = await login({
      googleId: '1',
      email: 'rootUser@company.hu',
    })

    // when
    const response = await blacklistUser({
      as: sessionToken,
      email: 'randomUser@company.hu',
    })

    // then
    const users = await database.User.findAll()
    expect(users).toHaveLength(2)

    const blacklistedUser = await database.User.findOne({
      where: { email: 'randomUser@company.hu' },
    })
    expect(blacklistedUser.isBlacklisted).toBe(true)
  })

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
    const users = await database.User.findAll()
    expect(users).toHaveLength(2)

    const blacklistedUser = await database.User.findOne({
      where: { email: 'randomUser@company.hu' },
    })
    expect(blacklistedUser.isBlacklisted).toBe(false)
  })

  test.todo('should blacklist admin as root')

  test.todo('should whitelist admin as root')
})
