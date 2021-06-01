const DefaultPlugin = require('./plugins/pluginInterface')
const {Users, Token} = require('./appSystems/auth/logic')
const {DEFAULT_KEY_STORE, DEFAULT_TEMP_PASS} = require('./constants')
const {
  PasswordRepo,
  TemporaryPasswordRepo,
  TokenRepo,
  UserRepo,
  UserVerificationRepo
} = require('./appSystems/auth/repos')

/**
 * config object
 * {plugin}
 * {keyStore: {keyCount, timeLimit}}
 * {temporaryPasswordOptions: {tempPasswordLifetime}}
 */
class Authentication {
  constructor (config) {
    this.plugin = DefaultPlugin
    this.repos = {}
    this.options = {
      keyStore: {...DEFAULT_KEY_STORE, ...config.keyStore},
      tempPasswordOptions: {...DEFAULT_TEMP_PASS, ...config.temporaryPasswordOptions}
    }
    this.addPlugin(config.plugin)
  }
  addPlugin(plugin) {
    for (let keyObject of Object.keys(DefaultPlugin)) {
      let pObj = plugin[keyObject]
      if (!pObj) {
        throw Error(`plugin Object ${keyObject} does not exist in plugin`)
      }
      for (let keyFunction of Object.keys(DefaultPlugin[keyObject])) {
        if (!pObj[keyFunction]) {
          throw Error(`plugin Object ${keyObject} does not have ${keyFunction} implemented in plugin`)
        }
      }
    }
    this.plugin = plugin
  }

  create () {
    this.repos = {
      passwordRepo: new PasswordRepo({plugin: this.plugin.PasswordRepo}),
      userRepo: new UserRepo({plugin: this.plugin.UserRepo}),
      tokenRepo: new TokenRepo({plugin: this.plugin.TokenRepo, keyStore: this.options.keyStore}),
      temporaryPasswordRepo: new TemporaryPasswordRepo({
        plugin: this.plugin.TemporaryPasswordRepo,
        options: this.options.tempPasswordOptions
      }),
      userVerificationRepo: new UserVerificationRepo({plugin: this.plugin.UserVerificationRepo})
    }
    return {
      __users: new Users({
        plugin: this.plugin,
        repos: this.repos,
        ...this.options
      }),
      __token: new Token({
        plugin: this.plugin,
        repos: this.repos,
        ...this.options
      })
    }
  }
}

let AUTH = {
  get users() {
    if (this.__users) {
      return this.__users
    } else {
      throw Error(`Must instantiate createAuthentication() first`)
    }
  },
  get token() {
    if (this.__token) {
      return this.__token
    } else {
      throw Error(`Must instantiate createAuthentication() first`)
    }
  },
  __created: false
}

module.exports = {
  auth: AUTH,
  /**
   * 
   * @param {Object} config - the config object
   * @param {Object} config.plugin - the plugin object
   * @param {Object} config.plugin.TemporaryPasswordRepo - the Tempoary Password Repo, will manage those CRUDs
   * @param {Function(user_id, newRandomPassword, createdTimestamp)} config.plugin.TemporaryPasswordRepo.insertNewUserIdAndPassword
   * @param {Function(user_id)} config.plugin.TemporaryPasswordRepo.selectTemporaryPasswordById
   * @param {Function(timesUpLimit)} config.plugin.TemporaryPasswordRepo.deleteAllOldTempPasswords
   * @param {Function(user_id)} config.plugin.TemporaryPasswordRepo.deleteTempPassword
   * @param {Object} config.plugin.TokenRepo - the TokenRepo, will manage those CRUDs
   * @param {Function()} config.plugin.TokenRepo.returnAllKeysFromRepo
   * @param {Function()} config.plugin.TokenRepo.deleteTheOldestKey
   * @param {Function(key, created)} config.plugin.TokenRepo.insertNewKey
   * @param {Object} config.plugin.UserRepo- the UserRepo, will manage those CRUDs
   * @param {Function(user_id)} config.plugin.UserRepo.getUserIsVerified
   * @param {Function(user_id)} config.plugin.UserRepo.verifyUser
   * @param {Function(user)} config.plugin.UserRepo.createUser
   * @param {Function(user)} config.plugin.UserRepo.getUser
   * @param {Function(user)} config.plugin.UserRepo.updateUser
   * @param {Object} config.plugin.UserVerificationRepo- the UserVerificationRepo, will manage those CRUDs
   * @param {Function(verification_code)} config.plugin.UserVerificationRepo.getVerificationCode
   * @param {Function(user_id, verification_code)} config.plugin.UserVerificationRepo.createVerificationCode
   * @param {Function(verification_code)} config.plugin.UserVerificationRepo.deleteVerificationCode
   * @param {Object} config.plugin.PasswordRepo- the PasswordRepo, will manage those CRUDs
   * @param {Function({user_id, password, key})} config.plugin.PasswordRepo.insertPassword
   * @param {Function(user_id)} config.plugin.PasswordRepo.deletePasswordById
   * @param {Function(user_id, password, key)} config.plugin.PasswordRepo.updatePasswordOnlyShouldBeUsedOnce
   * @param {Function(user_id)} config.plugin.PasswordRepo.getPasswordForId
   */
  createAuthentication: async function (config) {
    if (!AUTH.__created) {
      if (!config.plugin) {
        throw Error('There must be a plugin attribute in the config for the createAuthentication()')
      }
      let auth = new Authentication(config).create()
      for (let key of Object.keys(auth)) {
        AUTH[key] = auth[key]
      }
      AUTH.__created = true
    }
    return {
      auth: AUTH,
      config
    }
  }
}
/**
 * connection = pg.Client()
 * config.plugin = PostgresPlugin.create(connection)
 * createAuthentication(config)
 * auth.users
 * 
 */

// auth will have all the attributes that are in appSystems/auth/logic
