const DefaultPlugin = require('./plugins/pluginInterface')
const {Users, Token} = require('./appSystems/auth/logic')

class Authentication {
  constructor (config) {
    this.plugin = DefaultPlugin
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
      users: new Users(this.plugin),
      token: new Token(this.plugin)
    }
  }
}

module.exports = {
  auth: null,
  createAuthentication: async function (config) {
    this.auth = new Authentication(config).create()
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
