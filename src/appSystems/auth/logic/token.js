const PasswordRepo = require('../repos/PasswordRepo')
const UserRepo = require('../repos/UserRepo')
const TokenRepo = require('../repos/TokenRepo')
const Bluebird = require('bluebird')

class Token {
  constructor (options) {
    if (!options.plugin) {
      throw Error(`plugin does not exist for Users Logic`)
    }
    this.plugin = options.plugin
    this.passwordRepo = new PasswordRepo(this.plugin.passwordRepo)
    this.userRepo = new UserRepo(this.plugin.userRepo)
    this.tokenRepo = new TokenRepo(this.plugin.tokenRepo)
  }
  async generateToken (userId) {
    let keyStore = await this.tokenRepo.getKeyStore()
    return await keyStore.generateNewToken(userId)
  }
  async authenticateToken (token) {
    let keyStore = await this.tokenRepo.getKeyStore()
    return keyStore.checkToken(token)
  }
  async login (userId, password) {
    let results = await Bluebird.props({
      success: this.passwordRepo.checkPassword(userId, password),
      userIsVerified: this.userRepo.userIsVerified(userId)
    })
    if (results.success && results.userIsVerified) {
      return {success: true, token: await this.generateToken(userId)}
    } else {
      return {success: false}
    }
  }
}

// JAKE TODO need to correct Token
module.exports = {
  Token
}
