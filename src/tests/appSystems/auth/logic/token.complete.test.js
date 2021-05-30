const {Token} = require('../../../../appSystems/auth/logic/token')
const {Users} = require('../../../../appSystems/auth/logic/users')
const {tokenMock, usersMock} = require('../../../mocks')
const MockPlugin = require('../../../../plugins/pluginMock')
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

// TODO need to update the tests so that they are more like the auth-pg tests

describe('Token', function () {
  before(function (done) {
    token = new Token({...tokenMock})
    done()
  })

  describe('#generateToken',function () {
    it('should generate a token', function (done) {
      token.generateToken(userInfo.user_id).then(generatedAuthToken => {
        expect(generatedAuthToken).to.be.an('string')
        done()
      }).catch(console.error)
    })
    it('should fail when a undefined or null is inserted', function (done) {
      token.generateToken(null).catch(err => {
        expect(err.message).to.be.a('string')
        done()
      })
    })
  })
  describe('#authenticateToken', function () {
    it('it should authenticate the user', function (done) {
      token.generateToken(userInfo).then(async generatedAuthToken => {
        expect(generatedAuthToken).to.be.an('string')
        let auth = await token.authenticateToken(generatedAuthToken)
        auth.should.be.equal(true)
        done()
      }).catch(console.error)
    })
    it('it should return false on false authentication', function (done) {
      token.generateToken(userInfo).then(async generatedAuthToken => {
        expect(generatedAuthToken).to.be.an('string')
        let auth = await token.authenticateToken(generatedAuthToken)
        auth.should.be.equal(true)
        let authResp = await token.authenticateToken('eyJhbGciOiJIUzI1NiJ9.bmFtZUByYWVtaXN0ZW1haWwuY29t.d5qu_8bzMwhWygglDWKbY9n4daCYbnbR4w-enghUI5c')
        expect(authResp).to.be.equal(false)
        done()
      }).catch(console.error)
    })
  })
  describe('#login', function () {
    before(function (done) {
      MockPlugin.reset()
      done()
    })
    it('should login the user', function (done) {
      let password = userInfo.password
      let users = new Users({...usersMock})
      users.createUserVerificationAndPassword(userInfo).then(async (userVerification) => {
        let loginResponse = await token.login(userInfo.user_id, password)
        expect(loginResponse.success).to.be.equal(true)
        expect(loginResponse.token).to.be.a('string')
        done()
      })
    })// END OF IT
    it('should recognize that the user used forgotten password', function (done) {
      userInfo.password = 'password'
      let users = new Users({...usersMock})
      users.createUserVerificationAndPassword(userInfo).then((userVerification) => {
        users.forgotPassword(userInfo.user_id).then(async userInfoTempPassword => {
          let loginResponse = await token.login(userInfo.user_id, userInfoTempPassword.password)
          expect(loginResponse.success).to.be.equal(true)
          expect(loginResponse.verifiedWithTemporary).to.be.equal(true)
          done()
        }).catch(console.error)
      }).catch(console.error)
    })//END OF IT
    it('should return false if the password is not valid', function (done) {
      userInfo.password = 'password'
      let users = new Users({...usersMock})
      users.createUserVerificationAndPassword(userInfo).then((userVerification) => {
        users.forgotPassword(userInfo.user_id).then(async userInfoTempPassword => {
          let loginResponse = await token.login(userInfo.user_id, null)
          expect(loginResponse.success).to.be.equal(false)
          done()
        }).catch(console.error)
      }).catch(console.error)
    })//END OF IT
    it('should return false if the user is null', function (done) {
      userInfo.password = 'password'
      let users = new Users({...usersMock})
      users.createUserVerificationAndPassword(userInfo).then((userVerification) => {
        users.forgotPassword(userInfo.user_id).then(async userInfoTempPassword => {
          let loginResponse = await token.login(null, null)
          expect(loginResponse.success).to.be.equal(false)
          done()
        }).catch(console.error)
      }).catch(console.error)
    })//END OF IT
    it('should return false if the user does not exist', function (done) {
      userInfo.password = 'password'
      let users = new Users({...usersMock})
      users.createUserVerificationAndPassword(userInfo).then((userVerification) => {
        users.forgotPassword(userInfo.user_id).then(async userInfoTempPassword => {
          let loginResponse = await token.login('garjack', 'crap')
          expect(loginResponse.success).to.be.equal(false)
          done()
        }).catch(console.error)
      }).catch(console.error)
    })//END OF IT
  })
})
