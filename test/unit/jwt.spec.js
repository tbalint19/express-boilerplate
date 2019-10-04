'use strict'

var expect = require('expect.js')
var { parse } = require('../../src/utils/jwt.js')

describe('JWT tests', function() {
  it('should parse invalid jwt to null', async function() {
    // given
    let jwt = 'abc'

    // when
    let payload = await parse(jwt)

    // then
    expect(payload).to.be(null)
  })

  it('should parse valid jwt to payload', async function() {
    // given
    let jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

    // when
    let payload = await parse(jwt)

    // then
    expect(payload).to.eql({
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022,
    })
  })
})
