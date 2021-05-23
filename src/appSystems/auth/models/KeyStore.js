const {crypt} = require('../../../common/crypt')

class KeyStore {
  /**
   * assumes that the 0th key is the most recent key
   * @param {*} keys 
   */
  constructor (keys) {
    this.__keys = keys
  }

  async checkToken (token) {
    for (let k of this.__keys) {
      try{
        let info = await crypt.de(token, k)
        return true
      } catch (err) {}
    }
    throw Error('invalid signature from KeyStore')
  }

  async generateNewToken (tokenizeObject) {
    return await crypt.en(tokenizeObject, this.getLastKey())
  }

  async __generateNewTokenUsingLastKey (tokenizeObject) {
    return await crypt.en(tokenizeObject, this.__keys[this.__keys.length - 1])
  }

  getLastKey () {
    return this.__keys[0]
  }

  sliceAKey (newKey) {
    let newKeys = [newKey]
    for (let i = 0; i < this.__keys.length - 1; i++) {
      newKeys.push(this.__keys[i])
    }
    this.__keys = newKeys
  }

}

module.exports = {
  KeyStore
}
