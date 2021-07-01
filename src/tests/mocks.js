const PluginMock = require('../plugins/pluginMock')
const constants = require('../constants')
const {
  PasswordRepo,
  TemporaryPasswordRepo,
  TokenRepo,
  UserRepo,
  UserVerificationRepo
}= require('../appSystems/auth/repos')

const repos = {
  passwordRepo: new PasswordRepo({plugin: PluginMock.PasswordRepo}),
  userRepo: new UserRepo({plugin: PluginMock.UserRepo}),
  tokenRepo: new TokenRepo({plugin: PluginMock.TokenRepo, keyStore: constants.DEFAULT_KEY_STORE}),
  temporaryPasswordRepo: new TemporaryPasswordRepo({
    plugin: PluginMock.TemporaryPasswordRepo,
    options: constants.DEFAULT_TEMP_PASS
  }),
  userVerificationRepo: new UserVerificationRepo({plugin: PluginMock.UserVerificationRepo})
}

module.exports = {
  usersMock: {
    plugin: PluginMock,
    tempPasswordOptions: constants.DEFAULT_TEMP_PASS,
    repos
  },
  tokenMock: {
    plugin: PluginMock,
    keyStore: constants.DEFAULT_KEY_STORE,
    repos
  }
}