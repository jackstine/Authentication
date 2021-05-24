const PasswordRepo = require('../repos/PasswordRepo')
const UserRepo = require('../repos/UserRepo')
const TokenRepo = require('../repos/TokenRepo')
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
    for (let plugin of ['PasswordRepo', 'UserRepo', 'TokenRepo']) {
      if (!this.plugin[plugin]) {
        throw Error(`Object "${plugin}" does not exist in plugin`)
      }
    }
    this.keyStore = options.keyStore
    this.passwordRepo = new PasswordRepo({plugin: this.plugin.PasswordRepo})
    this.userRepo = new UserRepo({plugin: this.plugin.UserRepo})
    this.tokenRepo = new TokenRepo({plugin: this.plugin.TokenRepo, keyStore: this.keyStore})
  }
  /**
   * 
   * @param {*} userId 
   */
  async generateToken (userId) {
    let keyStore = await this.tokenRepo.getKeyStore()
    return await keyStore.generateNewToken(userId)
  }
  /**
   * 
   * @param {*} token 
   */
  async authenticateToken (token) {
    let keyStore = await this.tokenRepo.getKeyStore()
    return keyStore.checkToken(token)
  }
  /**
   * 
   * @param {*} userId 
   * @param {*} password 
   */
  async login (userId, password) {
    let passwordResult = await this.passwordRepo.checkPassword(userId, password)
    if (passwordResult) {
      return {success: true, token: await this.generateToken(userId)}
    } else {
      return {success: false}
    }
  }
}

module.exports = {
  Token
}
