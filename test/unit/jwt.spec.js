const { create, verify, parse } = require('../../src/utils/jwt.js')
const MockDate = require('mockdate')
const jwtConfig = require('../../config')['jwt']
const jwtSecret = jwtConfig.secret
const jwtLifeTimeInMillis = jwtConfig.lifeTime.split("h")[0] * 60 * 60 * 1000

describe('JWT tests', function() {

  it('should create jwt', async () => {
    // given
    const randomPointInTime = 1516239000
    const jwtExpiration = randomPointInTime + jwtLifeTimeInMillis
    const data = { foo: 'bar' }

    MockDate.set(new Date(randomPointInTime))

    // when
    let jwt = await create(data)

    // then
    let payload = await parse(jwt)
    expect(payload).toEqual(
      { ...data,
        iat: randomPointInTime/1000,
        exp: jwtExpiration/1000
      }
    )
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
