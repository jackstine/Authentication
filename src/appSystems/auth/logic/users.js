const UserVerificationRepo = require('../repos/UserVerificationRepo')
const TemporaryPasswordRepo = require('../repos/TemporaryPasswordRepo')
const UserRepo = require('../repos/UserRepo')
const PasswordRepo = require('../repos/PasswordRepo')
const Bluebird = require('bluebird')

class Users {
  constructor (options) {
    if (!options.plugin) {
      throw Error(`plugin does not exist for Users Logic`)
    }
    this.plugin = options.plugin
    this.userVerificationRepo = new UserVerificationRepo(this.plugin.userVerificationRepo)
    this.temporaryPasswordRepo = new TemporaryPasswordRepo(this.plugin.temporaryPasswordRepo)
    this.userRepo = new UserRepo(this.plugin.userRepo)
    this.passwordRepo = new PasswordRepo(this.plugin.passwordRepo)
  }
  /**
   * 
   * @param {password, uersId} userInfo 
   */
  async createUserVerificationAndPassword (userInfo) {
    let password = userInfo.password
    delete userInfo.password
    userInfo.userId = userInfo.userId
    let userData = await Bluebird.props({
      user: this.userRepo.createUser({userId}),
      verification: this.userVerificationRepo.createVerificationCode(userInfo.userId),
      password: this.passwordRepo.insert(userInfo.userId, password)
    })
    delete userData.password
    return userData
  }


  async verifyUser (verificationCode) {
    let userVC = await this.userVerificationRepo.getVerificationCode(verificationCode)
    if (userVC) {
      await this.userVerificationRepo.delete(verificationCode)
      return await this.userRepo.verifyUser(userVC.user_id)
    } else {
      return false
    }
  }

  async resetPasswordFromTemporaryPassword (userId, tempPassword, newPassword) {
    let verifiedTempPassword = await this.temporaryPasswordRepo.verifyTemporyPassword(userId, tempPassword)
    if (verifiedTempPassword) {
      return await Bluebird.props({
        temp: this.temporaryPasswordRepo.delete(userId),
        newPassword: this.passwordRepo.__OverrideUpdatePasswordNeverUseOnlyDireSituations(userId, newPassword)
      })
    } else {
      return false
    }
  }

  async forgotPassword (userId) {
    let tempPassword = await this.temporaryPasswordRepo.createTempPassword(userId)
    // TODO needs to be in the plugin function
    // TODO email the temp password to the user
  }
}


module.exports = {
  Users
}
