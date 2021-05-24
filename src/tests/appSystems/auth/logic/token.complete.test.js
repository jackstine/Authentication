const {Token} = require('../../../../appSystems/auth/logic/token')
const {Users} = require('../../../../appSystems/auth/logic/users')
const PluginMock = require('../../../../plugins/pluginMock')
let chai = require('chai')
let expect = chai.expect
chai.should()

 
let userInfo = {
  firstName: 'jacob',
  lastName: 'cukjati',
  username: 'jacobCukjati@gmail.com',
  email: 'jacobCukjati@gmail.com',
  userId: 'jacobCukjati@gmail.com',
  phone: '8503616563',
  password: 'password'
}
let vc = 'd4a2435d-9287-414c-aee7-824d5527e1d7'
let token = new Token({plugin: PluginMock})

describe('Token', function () {
  before(function (done) {
    token = new Token({plugin: PluginMock})
    done()
  })

  it('#generateToken', function (done) {
    token.generateToken(userInfo.userId).then(generatedAuthToken => {
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
    let users = new Users({plugin: PluginMock})
    users.createUserVerificationAndPassword(userInfo).then(async (userVerification) => {
      let loginResponse = await token.login(userInfo.userId, password)
      expect(loginResponse.success).to.be.equal(true)
      expect(loginResponse.token).to.be.a('string')
      done()
    })
  })
})
