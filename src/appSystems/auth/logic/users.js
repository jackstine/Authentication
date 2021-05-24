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
    for (let plugin of ['UserVerificationRepo', 'TemporaryPasswordRepo', 'UserRepo', 'PasswordRepo']) {
      if (!this.plugin[plugin]) {
        throw Error(`Object "${plugin}" does not exist in plugin`)
      }
    }
    this.plugin = options.plugin
    this.options = options
    this.userVerificationRepo = new UserVerificationRepo({plugin: this.plugin.UserVerificationRepo})
    this.temporaryPasswordRepo = new TemporaryPasswordRepo({
      plugin: this.plugin.TemporaryPasswordRepo,
      options: options.tempPasswordOptions
    })
    this.userRepo = new UserRepo({plugin: this.plugin.UserRepo})
    this.passwordRepo = new PasswordRepo({plugin: this.plugin.PasswordRepo})
  }
  /**
   * 
   * @param {password, uersId} userInfo 
   */
  async createUserVerificationAndPassword (userInfo) {
    if (!userInfo.userId) {
      throw Error('must contain userId attribute in Object')
    }
    if (!userInfo.password) {
      throw Error('must contain password attribute in Object')
    }
    let password = userInfo.password
    delete userInfo.password
    let userId = userInfo.userId
    let userData = await Bluebird.props({
      user: this.userRepo.createUser({userId}),
      verification: this.userVerificationRepo.createVerificationCode(userInfo.userId),
      password: this.passwordRepo.insert(userInfo.userId, password)
    })
    delete userData.password
    return userData
  }


  /**
   * {
        userId: 'jacobcukjati@gmail.com',
        verificationCode: 'fb2e2a6a-088d-4e79-9b89-f258b48a03f3'
      }
      { userId: 'jacobcukjati@gmail.com', verified: true }
   * @param {*} verificationCode 
   */
  async verifyUser (verificationCode) {
    let userVC = await this.userVerificationRepo.getVerificationCode(verificationCode)
    if (userVC) {
      await this.userVerificationRepo.delete(verificationCode)
      return await this.userRepo.verifyUser(userVC.userId)
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
    return tempPassword
  }
}


module.exports = {
  Users
}
