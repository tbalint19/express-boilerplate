const { authorize } = require('../../src/utils/authorize.js')

describe('Authorization tests', () => {

  it('should not throw for true', async () => {
    // given
    const userRole = 'USER'

    // when
    const requiredRole = 'USER'

    // then
    expect(() => authorize(userRole == requiredRole)).not.toThrow()
  })

  it('should throw for false', async () => {
    // given
    const userRole = 'USER'

    // when
    const requiredRole = 'ADMIN'

    // then
    expect(() => authorize(userRole == requiredRole)).toThrow()
  })

})
