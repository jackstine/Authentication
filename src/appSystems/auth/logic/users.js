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
    this.repos = options.repos
    this.userVerificationRepo = this.repos.userVerificationRepo
    this.temporaryPasswordRepo = this.repos.temporaryPasswordRepo
    this.userRepo = this.repos.userRepo
    this.passwordRepo = this.repos.passwordRepo
  }
  /**
   * 
   * @param {password, uersId} userInfo 
   */
  async createUserVerificationAndPassword (userInfo) {
    if (!userInfo.user_id) {
      throw Error('must contain user_id attribute in Object')
    }
    if (!userInfo.password) {
      throw Error('must contain password attribute in Object')
    }
    let password = userInfo.password
    delete userInfo.password
    let user_id = userInfo.user_id
    let userData = await Bluebird.props({
      user: this.userRepo.createUser({user_id}),
      verification: this.userVerificationRepo.createVerificationCode(userInfo.user_id),
      password: this.passwordRepo.insert(userInfo.user_id, password)
    })
    delete userData.password
    return userData
  }


  /**
   * {
        user_id: 'jacobcukjati@gmail.com',
        verificationCode: 'fb2e2a6a-088d-4e79-9b89-f258b48a03f3'
      }
      { user_id: 'jacobcukjati@gmail.com', verified: true }
   * @param {*} verificationCode 
   */
  async verifyUser (verificationCode) {
    let userVC = await this.userVerificationRepo.getVerificationCode(verificationCode)
    if (userVC) {
      await this.userVerificationRepo.delete(verificationCode)
      return await this.userRepo.verifyUser(userVC.user_id)
    } else {
      return {verified: false}
    }
  }

  async resetPasswordFromTemporaryPassword (user_id, tempPassword, newPassword) {
    try {
      let verifiedTempPassword = await this.temporaryPasswordRepo.verifyTemporyPassword(user_id, tempPassword)
      if (verifiedTempPassword) {
        let result = await Bluebird.props({
          temp: this.temporaryPasswordRepo.delete(user_id),
          newPassword: this.passwordRepo.__OverrideUpdatePasswordNeverUseOnlyDireSituations(user_id, newPassword)
        })
        return result.newPassword && result.temp
      } else {
        return false
      }
    } catch (ex) {
      return false
    }
  }

  async forgotPassword (user_id) {
    try {
      let user = await this.userRepo.getUser(user_id)
      if (user) {
        let tempPassword = await this.temporaryPasswordRepo.createTempPassword(user_id)
        return tempPassword
      } else {
        return null
      }
    } catch (ex) {
      return null
    }
  }
}


module.exports = {
  Users
}
