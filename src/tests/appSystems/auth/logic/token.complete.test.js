const {Token} = require('../../../../appSystems/auth/logic/token')
const {Users} = require('../../../../appSystems/auth/logic/users')
const {tokenMock, usersMock} = require('../../../mocks')
let chai = require('chai')
let expect = chai.expect
chai.should()

 
let userInfo = {
  firstName: 'jacob',
  lastName: 'cukjati',
  username: 'jacobCukjati@gmail.com',
  email: 'jacobCukjati@gmail.com',
  user_id: 'jacobCukjati@gmail.com',
  phone: '8503616563',
  password: 'password'
}
let vc = 'd4a2435d-9287-414c-aee7-824d5527e1d7'
let token = new Token({...tokenMock})

describe('Token', function () {
  before(function (done) {
    token = new Token({...tokenMock})
    done()
  })

  it('#generateToken', function (done) {
    token.generateToken(userInfo.user_id).then(generatedAuthToken => {
      expect(generatedAuthToken).to.be.an('string')
      done()
    }).catch(console.error)
  })
  it('#authenticateToken', function (done) {
    token.generateToken(userInfo).then(async generatedAuthToken => {
      expect(generatedAuthToken).to.be.an('string')
      let auth = await token.authenticateToken(generatedAuthToken)
      auth.should.be.equal(true)
      await token.authenticateToken('eyJhbGciOiJIUzI1NiJ9.bmFtZUByYWVtaXN0ZW1haWwuY29t.d5qu_8bzMwhWygglDWKbY9n4daCYbnbR4w-enghUI5c').catch(resp => {
        // this means it threw an error
        done()
      })
    }).catch(console.error)
  })
  it('#login', function (done) {
    let password = userInfo.password
    let users = new Users({...usersMock})
    users.createUserVerificationAndPassword(userInfo).then(async (userVerification) => {
      let loginResponse = await token.login(userInfo.user_id, password)
      expect(loginResponse.success).to.be.equal(true)
      expect(loginResponse.token).to.be.a('string')
      done()
    })
  })
})
