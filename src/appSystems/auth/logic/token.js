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
  }
  /**
   * 
   * @param {*} user_id 
   */
  async generateToken (user_id) {
    let keyStore = await this.tokenRepo.getKeyStore()
    return await keyStore.generateNewToken(user_id)
  }
  /**
   * 
   * @param {*} token 
   */
  async authenticateToken (token) {
    try {
      let keyStore = await this.tokenRepo.getKeyStore()
      return await keyStore.checkToken(token)
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
        return {success: true, token: await this.generateToken(user_id)}
      } else {
        let isForgottenPassword = await this.temporaryPasswordRepo.verifyTemporyPassword(user_id, password)
        if (isForgottenPassword) {
          return {success: true, verifiedWithTemporary: true}
        }
      }
    }
    return {success: false}
  }
}

module.exports = {
  Token
}
