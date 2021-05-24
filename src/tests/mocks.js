const PluginMock = require('../plugins/pluginMock')
const constants = require('../constants')

module.exports = {
  usersMock: {
    plugin: PluginMock,
    tempPasswordOptions: constants.DEFAULT_TEMP_PASS
  },
  tokenMock: {
    plugin: PluginMock,
    keyStore: constants.DEFAULT_KEY_STORE
  }
}