const KS = require('../../../../appSystems/auth/models/KeyStore')
const TokenRepo = require('../../../../appSystems/auth/repos/TokenRepo')
 
let tokenObject = "3JEo7J8rGyDGBy7X3yemj0c7hgs="

describe('KeyStore', function () {
  describe('#KeyStore', function () {
    let keyStore = null
    before(function (done) {
      TokenRepo.__getAllKeys().then(resp => {
        keyStore = TokenRepo.__keyStore
        done()
      })
    })
    it('should getFirstKey', function (done) {
      console.log(keyStore.getFirstKey())
      done()
    })
    it('should shiftAKey', function (done) {
      keyStore.shiftAKey()
      console.log(keyStore.__keys)
      done()
    })
    it('should generateNewToken', function (done) {
      keyStore.generateNewToken(tokenObject).then(resp => {
        console.log(resp)
        done()
      })
    })
    it('should checkToken', function (done) {
      keyStore.__generateNewTokenUsingLastKey(tokenObject).then(async resp => {
        let check = await keyStore.checkToken(resp)
        done()
      })
    })
  })
})
