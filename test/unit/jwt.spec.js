const { create, verify, parse } = require('../../src/utils/jwt.js')
const MockDate = require('mockdate')
const jwtConfig = require('../../config')['jwt']
const jwtSecret = jwtConfig.secret
const jwtLifeTimeInMillis = jwtConfig.lifeTime.split('h')[0] * 60 * 60 * 1000

describe('JWT tests', () => {
  it('should create jwt', async () => {
    // given
    const randomPointInTime = 1516239000
    const jwtExpiration = randomPointInTime + jwtLifeTimeInMillis
    const data = { foo: 'bar' }

    MockDate.set(new Date(randomPointInTime))

    // when
    const jwt = await create(data)

    // then
    const payload = await parse(jwt)
    expect(payload).toEqual({
      ...data,
      iat: randomPointInTime / 1000,
      exp: jwtExpiration / 1000,
    })
  })

  it('should verify valid jwt', async () => {
    // given
    const randomPointInTime = 1516239000
    const jwtExpiration = randomPointInTime + jwtLifeTimeInMillis
    const data = { foo: 'bar' }

    MockDate.set(new Date(randomPointInTime))
    const jwt = await create(data)

    // when
    const payload = await verify(jwt)

    // then
    expect(payload).toEqual({
      ...data,
      iat: randomPointInTime / 1000,
      exp: jwtExpiration / 1000,
    })
  })

  it('should not verify expired jwt', async () => {
    // given
    const randomPointInTime = 1516239000
    const jwtExpiration = randomPointInTime + jwtLifeTimeInMillis
    const data = { foo: 'bar' }

    MockDate.set(new Date(randomPointInTime))
    const jwt = await create(data)
    MockDate.set(new Date(jwtExpiration + 1))

    // when
    const payload = await verify(jwt)

    // then
    expect(payload).toBe(null)
  })

  it('should not create jwt with manual exp', async () => {
    // given
    const randomPointInTime = 1516239000
    const jwtExpiration = randomPointInTime + jwtLifeTimeInMillis
    const data = { foo: 'bar', exp: 1 }

    MockDate.set(new Date(randomPointInTime))
    const jwt = await create(data)
    MockDate.set(new Date(jwtExpiration + 1000))

    // when
    const payload = await verify(jwt)

    // then
    expect(payload).toBe(null)
  })

  it('should parse invalid jwt to null', async () => {
    // given
    let jwt = 'abc'

    // when
    let payload = await parse(jwt)

    // then
    expect(payload).toBe(null)
  })
})
