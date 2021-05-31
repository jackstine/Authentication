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
let userUpdateInfo = {
  user_id: userInfo.user_id,
  shirt: 'large'
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
  describe('#createUserVerificationAndPassword', function () {
    it('it should create a user and their password', function (done) {
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
    it('it should error????? when there is no user_id', function (done) {
      users.createUserVerificationAndPassword({password: userInfo.password}).then(userAndVerification => {
      }).catch(err => {
        // i think an error is OK
        done()
      })
    })
    it('it should error????? when there is no password', function (done) {
      users.createUserVerificationAndPassword({user_id: userInfo.user_id}).then(userAndVerification => {
      }).catch(err => {
        // i think an error is OK
        done()
      })
    })
  })
  describe('#verifyUser', function (done) {
    it('it should verify that the verification code is correct', function (done) {
      users.createUserVerificationAndPassword(userInfo).then(userAndVerification => {
        let {verification} = userAndVerification
        users.verifyUser(verification.verification_code).then(user => {
          expect(user.verified).to.be.equal(true)
          expect(user.user_id).to.be.equal(userInfo.user_id.toLowerCase())
          done()
        }).catch(console.error)
      }).catch(console.error)
    })
    it('it should return false on inaccurate verification codes ', function (done) {
      users.createUserVerificationAndPassword(userInfo).then(async userAndVerification => {
        let user = await users.verifyUser('73c89749-43a9-4e6d-83d7-37a8c70ca265')
        expect(user.verified).to.be.equal(false)
        user = await users.verifyUser(null)
        expect(user.verified).to.be.equal(false)
        user = await users.verifyUser('43a9-4e6d-83d7-37a8c70ca265')
        expect(user.verified).to.be.equal(false)
        done()
      }).catch(console.error)
    })
  })
  describe('#forgotPassword', function () {
    it('it should generate a new temporary password if the user forgot', function (done) {
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
    it('it should return null, if no user', function (done) {
      users.forgotPassword(null).then(userInfoTempPassword => {
        expect(userInfoTempPassword).to.be.null
        done()
      }).catch(console.error)
    })
    it('it should return null, if no user', function (done) {
      users.forgotPassword('dummyUser').then(userInfoTempPassword => {
        expect(userInfoTempPassword).to.be.null
        done()
      }).catch(console.error)
    })
  })
  describe('#resetPasswordFromTemporaryPassword', function () {
    it('should reset the password from temp password', function (done) {
      users.createUserVerificationAndPassword(userInfo).then(userAndVerification => {
        users.forgotPassword(userInfo.user_id).then(userInfoTempPassword => {
          users.resetPasswordFromTemporaryPassword(userInfo.user_id, userInfoTempPassword.password, userInfo.newPassword).then(resp => {
            expect(resp).to.be.equal(true)
            done()
          }).catch(console.error)
        }).catch(console.error)
      }).catch(console.error)
    })
    it('should should not reset if the password or user_id is not valid', function (done) {
      users.resetPasswordFromTemporaryPassword(null, 'password', userInfo.newPassword).then(async resp => {
        expect(resp).to.be.equal(false)
        let temp = await users.resetPasswordFromTemporaryPassword(null, null, userInfo.newPassword)
        expect(temp).to.be.equal(false)
        temp = await users.resetPasswordFromTemporaryPassword('null', null, null)
        expect(temp).to.be.equal(false)
        temp = await users.resetPasswordFromTemporaryPassword('null', 'null', null)
        expect(temp).to.be.equal(false)
        done()
      }).catch(console.error)
    })
    it('should verify that the temp password is valid', function (done) {
      users.createUserVerificationAndPassword(userInfo).then(userAndVerification => {
        users.forgotPassword(userInfo.user_id).then(userInfoTempPassword => {
          users.resetPasswordFromTemporaryPassword(userInfo.user_id, 'dsfjkhaskdjhfjksd', 'jfaksjdhfkjwehfj').then(resp => {
            expect(resp).to.be.equal(false)
            done()
          }).catch(console.error)
        }).catch(console.error)
      }).catch(console.error)
    })
  })
  describe('#getUser', function () {
    it('should get the user', function (done) {
      users.createUserVerificationAndPassword(userInfo).then(async userAndVerification => {
        let {user, verification, password} = userAndVerification
        let gu = await users.getUser(user.user_id)
        expect(gu.user_id).to.be.equal(user.user_id)
        done()
      }).catch(console.error)
    })
    it('should return null when the user does not exist', function (done) {
      users.getUser('garjack').then(async user => {
        expect(user).to.be.null
        user = await users.getUser(null).catch(console.error)
        expect(user).to.be.null
        user = await users.getUser(null)
        expect(user).to.be.null
        done()
      })
    })
  })
  describe('#updateUser', function () {
    it('should update the user', function (done) {
      users.createUserVerificationAndPassword(userInfo).then(async userAndVerification => {
        users.updateUser(userUpdateInfo).then(resp => {
          expect(resp.success).to.be.equal(true)
          expect(resp.user.shirt).to.be.equal(userUpdateInfo.shirt)
          done()
        }).catch(console.error)
      })
    })
    it('should return false if the user does not exist', function (done) {
      users.updateUser({user_id: 'something'}).then(async resp => {
        expect(resp.success).to.be.equal(false)
        resp = await users.updateUser(null)
        expect(resp.success).to.be.equal(false)
        done()
      }).catch(console.error)
    })
  })
})

