const Bluebird = require('bluebird')

class Token {
  /**
   * 
   * @param {passwordRepo, userRepo, tokenRepo} options.plugin 
   */
  constructor (options) {
    if (!options.plugin) {
      throw Error(`plugin does not exist for Users Logic`)
    }
    this.plugin = options.plugin
    for (let plugin of ['PasswordRepo', 'UserRepo', 'TokenRepo', 'TemporaryPasswordRepo']) {
      if (!this.plugin[plugin]) {
        throw Error(`Object "${plugin}" does not exist in plugin`)
      }
    }
    this.repos = options.repos
    this.keyStore = options.keyStore
    this.passwordRepo = this.repos.passwordRepo
    this.userRepo = this.repos.userRepo
    this.tokenRepo = this.repos.tokenRepo
    this.temporaryPasswordRepo = this.repos.temporaryPasswordRepo
    this.userVerificationRepo = this.repos.userVerificationRepo
    this.google = require('./google-auth').google
    this.googleClientId = options.googleClientId
  }
  /**
   * 
   * @param {*} user_id 
   */
  async generateToken (user_id) {
    if (user_id) {
      let user_id_is_object = typeof user_id === 'object' && user_id !== null
      if (!user_id_is_object) {
        user_id = {user_id}
      }
      // TODO probably need to get the user, to ensure that the
      // user_id is valid.
      // let user = await this.userRepo.getUser(user_id)
      return await this.tokenRepo.generateNewToken(user_id)
    } else {
      throw Error('The User Id does not exist, we cannot make a user')
    }
  }
  /**
   * 
   * @param {*} token 
   */
  async authenticateToken (token) {
    try {
      return await this.tokenRepo.authenticateToken(token)
    } catch (ex) {
      return false
    }
  }
  /**
   * 
   * @param {*} user_id 
   * @param {*} password 
   */
  async login (user_id, password) {
    if (user_id && password) {
      let passwordResult = await this.passwordRepo.checkPassword(user_id, password)
      if (passwordResult) {
        let ps = await Promise.all([this.generateToken({user_id}), this.userRepo.getUser(user_id)])
        return {success: true, token: ps[0], user: ps[1]}
      } else {
        let isForgottenPassword = await this.temporaryPasswordRepo.verifyTemporyPassword(user_id, password)
        if (isForgottenPassword) {
          return {success: true, verifiedWithTemporary: true}
        }
      }
    }
    return {success: false}
  }

  /**
   * 
   * @param {*} token 
   * @returns 
   */
  async googleSignin (token) {
    this.google.setup(this.googleClientId)
    let result = await this.google.verify(token)
    if (result.success) {
      let user = result.user
      user.user_id = user.email
      let user_id = user.user_id
      let userExists = await this.userRepo.getUser(user_id)
      if (!userExists) {
        let userData = await Bluebird.props({
          success: true,
          is_new_user: true,
          user: this.userRepo.createUser(user),
          verification: this.userVerificationRepo.createVerificationCode(user_id),
          token: this.tokenRepo.generateNewToken(user_id)
        })
        return userData
      } else {
        return await Bluebird.props({
          success: true,
          is_new_user: false,
          user: user,
          token: this.tokenRepo.generateNewToken(user_id)
        })
      }
    } else {
      return {success: false}
    }
  }
}

module.exports = {
  Token
}
