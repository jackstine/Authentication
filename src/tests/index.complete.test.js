const {createAuthentication, auth} = require('../index')
const PluginMock = require('../plugins/pluginMock')
const chai = require('chai')
let expect = chai.expect
chai.should()

describe('Authentication', function () {
  describe('#auth', function () {
    it('should fail without createAuthentication', function (done) {
      let func = () => {auth.token}
      expect(func).to.throw()
      done()
    })
  })
  describe('#createAuthentication', function () {
    it('should create the authentication object', function (done) {
      createAuthentication({plugin: PluginMock}).then(resp => {
        expect(auth.users).to.not.be.undefined
        expect(auth.token).to.not.be.undefined
        done()
      }).catch(console.error)
    })
  })
})