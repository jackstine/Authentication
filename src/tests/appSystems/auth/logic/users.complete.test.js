const {Users} = require('../../../../appSystems/auth/logic/users')
const {usersMock} = require('../../../mocks')
let chai = require('chai')
let expect = chai.expect
chai.should()

let userInfo = {
  user_id: 'jacobCukjati@gmail.com',
  password: 'password',
  newPassword: 'newPassword'
}
let userInfoClone = {...userInfo}
let vc = '3e5764ed-fa5a-4e40-be4e-fbe228d009d2'
let users = new Users({...usersMock})

describe('Users', function () {
  beforeEach((done => {
    usersMock.plugin.reset()
    userInfo = {...userInfoClone}
    users = new Users({...usersMock})
    done()
  }))
  it('#createUserVerificationAndPassword', function (done) {
    users.createUserVerificationAndPassword(userInfo).then(userAndVerification => {
      let {user, verification, password} = userAndVerification
      expect(user.user_id).to.be.equal(userInfo.user_id.toLowerCase())
      expect(user.verified).to.be.equal(false)
      expect(verification.user_id).to.be.equal(userInfo.user_id.toLowerCase())
      expect(verification.verification_code).to.be.a('string')
      expect(password).to.be.undefined
      done()
    }).catch(console.error)
  })
  it('#verifyUser', function (done) {
    users.createUserVerificationAndPassword(userInfo).then(userAndVerification => {
      let {verification} = userAndVerification
      users.verifyUser(verification.verification_code).then(user => {
        expect(user.verified).to.be.equal(true)
        expect(user.user_id).to.be.equal(userInfo.user_id.toLowerCase())
        done()
      }).catch(console.error)
    }).catch(console.error)
  })
  it('#forgotPassword', function (done) {
    users.createUserVerificationAndPassword(userInfo).then(userAndVerification => {
      users.forgotPassword(userInfo.user_id).then(userInfoTempPassword => {
        let {user_id, password, expiresIn} = userInfoTempPassword
        expect(user_id).to.be.equal(userInfo.user_id.toLowerCase())
        expect(password).to.be.a('string')
        expect(expiresIn).to.be.a('number')
        done()
      }).catch(console.error)
    }).catch(console.error)
  })
  it('#resetPasswordFromTemporaryPassword', function (done) {
    users.createUserVerificationAndPassword(userInfo).then(userAndVerification => {
      users.forgotPassword(userInfo.user_id).then(userInfoTempPassword => {
        users.resetPasswordFromTemporaryPassword(userInfo.user_id, userInfoTempPassword.password, userInfo.newPassword).then(resp => {
          expect(resp).to.be.equal(true)
          done()
        }).catch(console.error)
      }).catch(console.error)
    }).catch(console.error)
  })
})
