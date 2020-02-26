const {
  is,
  can,
  isAuthenticated,
} = require('../../src/middleware/authorization/chain')
const authorize = require('../../src/middleware/authorization')
const SessionUser = require('../../src/middleware/sessionUserResolver/sessionUser')
const AnonymousUser = require('../../src/middleware/sessionUserResolver/anonymousUser')

describe('Authorization tests', () => {
  beforeEach(() => {
    next.mockClear()
    status.mockClear()
    json.mockClear()
  })

  it('should return 401 with no user', async () => {
    // given
    const res = response({ locals: {} })
    const middleware = authorize(isAuthenticated())

    // when
    middleware(req, res, next)

    // then
    expect401with(res, {
      user: undefined,
      grant: {
        possibleRoles: null,
        possiblePermissions: null,
        requiredScope: null,
      },
    })
  })

  it('should return 401 with anonymousUser', async () => {
    // given
    const res = response({ locals: { user: new AnonymousUser() } })
    const middleware = authorize(isAuthenticated())

    // when
    middleware(req, res, next)

    // then
    expect401with(res, {
      user: anonymous,
      grant: {
        possibleRoles: null,
        possiblePermissions: null,
        requiredScope: null,
      },
    })
  })

  it('should go to next with sessionUser', async () => {
    // given
    const res = response({ locals: { user: new SessionUser(user) } })
    const middleware = authorize(isAuthenticated())

    // when
    middleware(req, res, next)

    // then
    expectPass(res)
  })

  it('should return 403 without unscoped role', async () => {
    // given
    const res = response({ locals: { user: new SessionUser(user) } })
    const middleware = authorize(is('ROOT'))

    // when
    middleware(req, res, next)

    // then
    expect403with(res, {
      user: user,
      grant: {
        possibleRoles: ['ROOT'],
        possiblePermissions: null,
        requiredScope: null,
      },
    })
  })

  it('should pass with one valid role', async () => {
    // given
    const res = response({ locals: { user: new SessionUser(user) } })
    const middleware = authorize(is('ROOT', 'USER'))

    // when
    middleware(req, res, next)

    // then
    expectPass(res)
  })

  it('should pass without valid role when condition is not met', async () => {
    // given
    const res = response({ locals: { user: new SessionUser(user), data: 1 } })
    const middleware = authorize(
      is('ROOT').when((req, res) => res.locals.data === 2)
    )

    // when
    middleware(req, res, next)

    // then
    expectPass(res)
  })

  it('should not pass without valid role when condition is met', async () => {
    // given
    const res = response({ locals: { user: new SessionUser(user), data: 1 } })
    const middleware = authorize(
      is('ROOT').when((req, res) => res.locals.data === 1)
    )

    // when
    middleware(req, res, next)

    // then
    expect403with(res, {
      user: user,
      grant: {
        possibleRoles: ['ROOT'],
        possiblePermissions: null,
        requiredScope: null,
      },
    })
  })

  it('should not pass without valid permission', async () => {
    // given
    const res = response({ locals: { user: new SessionUser(user) } })
    const middleware = authorize(can('DO_STUFF'))

    // when
    middleware(req, res, next)

    // then
    expect403with(res, {
      user: user,
      grant: {
        possibleRoles: null,
        possiblePermissions: ['DO_STUFF'],
        requiredScope: null,
      },
    })
  })

  it('should pass without valid permission when condition not met', async () => {
    // given
    const res = response({ locals: { user: new SessionUser(user), data: 1 } })
    const middleware = authorize(
      can('DO_STUFF').when((req, res) => res.locals.data == 2)
    )

    // when
    middleware(req, res, next)

    // then
    expectPass(res)
  })

  it('should not pass without valid permission when condition is met', async () => {
    // given
    const res = response({ locals: { user: new SessionUser(user), data: 1 } })
    const middleware = authorize(
      can('DO_STUFF').when((req, res) => res.locals.data == 1)
    )

    // when
    middleware(req, res, next)

    // then
    expect403with(res, {
      user: user,
      grant: {
        possibleRoles: null,
        possiblePermissions: ['DO_STUFF'],
        requiredScope: null,
      },
    })
  })

  it('should not pass without valid permission even if role is met', async () => {
    // given
    const res = response({ locals: { user: new SessionUser(user) } })
    const middleware = authorize(is('USER'), can('DO_STUFF'))

    // when
    middleware(req, res, next)

    // then
    expect403with(res, {
      user: user,
      grant: {
        possibleRoles: null,
        possiblePermissions: ['DO_STUFF'],
        requiredScope: null,
      },
    })
  })

  it('should pass with valid permission', async () => {
    // given
    const res = response({ locals: { user: new SessionUser(admin) } })
    const middleware = authorize(can('DO_STUFF'))

    // when
    middleware(req, res, next)

    // then
    expectPass(res)
  })

  it('should not pass without valid role for group', async () => {
    // given
    const res = response({ locals: { user: new SessionUser(member) } })
    const middleware = authorize(is('MEMBER').at('company2.events'))

    // when
    middleware(req, res, next)

    // then
    expect403with(res, {
      user: member,
      grant: {
        possibleRoles: ['MEMBER'],
        possiblePermissions: null,
        requiredScope: 'company2.events',
      },
    })
  })

  it('should pass with valid role for group', async () => {
    // given
    const res = response({ locals: { user: new SessionUser(member) } })
    const middleware = authorize(is('MEMBER').at('company1.events'))

    // when
    middleware(req, res, next)

    // then
    expectPass(res)
  })

  it('should not pass without valid permission for group', async () => {
    // given
    const res = response({ locals: { user: new SessionUser(member) } })
    const middleware = authorize(can('DO_STUFF').at('company2.events'))

    // when
    middleware(req, res, next)

    // then
    expect403with(res, {
      user: member,
      grant: {
        possibleRoles: null,
        possiblePermissions: ['DO_STUFF'],
        requiredScope: 'company2.events',
      },
    })
  })

  it('should pass with valid permission for group', async () => {
    // given
    const res = response({ locals: { user: new SessionUser(groupAdmin) } })
    const middleware = authorize(
      can('DO_STUFF', 'DO_SOMETHING').at('company1.events')
    )

    // when
    middleware(req, res, next)

    // then
    expectPass(res)
  })
})

const anonymous = {
  id: null,
  username: null,
  role: null,
  permissions: [],
}

const user = {
  id: 1,
  username: 'user-name',
  role: { name: 'USER' },
  permissions: [],
}

const admin = {
  id: 1,
  username: 'admin-name',
  role: { name: 'ADMIN' },
  permissions: [{ name: 'DO_SOMETHING' }, { name: 'DO_STUFF' }],
}

const member = {
  id: 1,
  username: 'member-name',
  role: { name: 'USER' },
  permissions: [],
  groups: {
    'company1.events': {
      role: { name: 'MEMBER' },
      permissions: [],
    },
  },
}

const groupAdmin = {
  id: 1,
  username: 'group-admin-name',
  role: { name: 'USER' },
  permissions: [],
  groups: {
    'company1.events': {
      role: { name: 'ADMIN' },
      permissions: [{ name: 'DO_THAT' }, { name: 'DO_SOMETHING' }],
    },
  },
}

const next = jest.fn()
const status = jest.fn()
const json = jest.fn()
const req = {}

const response = (data) => {
  let defaultResponse = {
    json,
    status,
  }
  return Object.assign({}, defaultResponse, data)
}

const expectPass = (res) => {
  expect(res.status.mock.calls.length).toBe(0)
  expect(res.json.mock.calls.length).toBe(0)
  expect(next.mock.calls.length).toBe(1)
}

const expect401with = (res, auth) => {
  expect(res.status.mock.calls.length).toBe(1)
  expect(res.status.mock.calls[0][0]).toBe(401)
  expect(res.json.mock.calls.length).toBe(1)
  expect(res.json.mock.calls[0][0]).toEqual(auth)
  expect(next.mock.calls.length).toBe(0)
}

const expect403with = (res, auth) => {
  expect(res.status.mock.calls.length).toBe(1)
  expect(res.status.mock.calls[0][0]).toBe(403)
  expect(res.json.mock.calls.length).toBe(1)
  expect(res.json.mock.calls[0][0]).toEqual(auth)
  expect(next.mock.calls.length).toBe(0)
}
