const DefaultPlugin = require('./plugins/pluginInterface')
const {Users, Token} = require('./appSystems/auth/logic')
const {DEFAULT_KEY_STORE, DEFAULT_TEMP_PASS} = require('./constants')

/**
 * config object
 * {plugin}
 * {keyStore: {keyCount, timeLimit}}
 * {temporaryPasswordOptions: {tempPasswordLifetime}}
 */
class Authentication {
  constructor (config) {
    this.plugin = DefaultPlugin
    // TODO return the timelimit on temp passwords
    this.keyStore = {...DEFAULT_KEY_STORE, ...config.keyStore}
    this.tempPasswordOptions = {...DEFAULT_TEMP_PASS, ...config.temporaryPasswordOptions}
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
    return {
      __users: new Users({
        plugin: this.plugin,
        tempPasswordOptions: this.tempPasswordOptions
      }),
      __token: new Token({
        plugin: this.plugin, 
        keyStore: this.keyStore
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
