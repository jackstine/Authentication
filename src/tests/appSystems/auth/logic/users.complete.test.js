const {Users} = require('../../../../appSystems/auth/logic/users')
const PluginMock = require('../../../../plugins/pluginMock')
let chai = require('chai')
let expect = chai.expect
chai.should()

let userInfo = {
  userId: 'jacobCukjati@gmail.com',
  password: 'password',
  newPassword: 'newPassword'
}
let userInfoClone = {...userInfo}
let vc = '3e5764ed-fa5a-4e40-be4e-fbe228d009d2'
let users = new Users({plugin: PluginMock})

describe('Users', function () {
  beforeEach((done => {
    PluginMock.reset()
    userInfo = {...userInfoClone}
    users = new Users({plugin: PluginMock})
    done()
  }))
  it('#createUserVerificationAndPassword', function (done) {
    users.createUserVerificationAndPassword(userInfo).then(userAndVerification => {
      let {user, verification, password} = userAndVerification
      expect(user.userId).to.be.equal(userInfo.userId.toLowerCase())
      expect(user.verified).to.be.equal(false)
      expect(verification.userId).to.be.equal(userInfo.userId.toLowerCase())
      expect(verification.verificationCode).to.be.a('string')
      expect(password).to.be.undefined
      done()
    }).catch(console.error)
  })
  it('#verifyUser', function (done) {
    users.createUserVerificationAndPassword(userInfo).then(userAndVerification => {
      let {verification} = userAndVerification
      users.verifyUser(verification.verificationCode).then(userInfo => {
        expect(userInfo.userId).to.be.equal(userInfo.userId.toLowerCase())
        expect(userInfo.verified).to.be.equal(true)
        done()
      }).catch(console.error)
    }).catch(console.error)
  })
  it('#forgotPassword', function (done) {
    users.createUserVerificationAndPassword(userInfo).then(userAndVerification => {
      users.forgotPassword(userInfo.userId).then(userInfoTempPassword => {
        let {userId, password} = userInfoTempPassword
        expect(userId).to.be.equal(userInfo.userId.toLowerCase())
        expect(password).to.be.a('string')
        done()
      }).catch(console.error)
    }).catch(console.error)
  })
  it('#resetPasswordFromTemporaryPassword', function (done) {
    users.createUserVerificationAndPassword(userInfo).then(userAndVerification => {
      users.forgotPassword(userInfo.userId).then(userInfoTempPassword => {
        users.resetPasswordFromTemporaryPassword(userInfo.userId, userInfoTempPassword.password, userInfo.newPassword).then(resp => {
          expect(resp.temp).to.be.undefined
          expect(resp.newPassword).to.be.undefined
          done()
        }).catch(console.error)
      }).catch(console.error)
    }).catch(console.error)
  })
})
