const {crypt} = require('../../../common/crypt')

class KeyStore {
  /**
   * assumes that the 0th key is the most recent key
   * @param {*} keys 
   */
  constructor (keys, maxKeys) {
    this.__keys = keys
    this.__maxKeys = maxKeys
  }

  async checkToken (token) {
    for (let k of this.__keys) {
      try{
        let info = await crypt.de(token, k.key)
        return true
      } catch (err) {
        // try catch for when decryption does not return successfully
      }
    }
    throw Error('invalid signature from KeyStore')
  }

  async generateNewToken (tokenizeObject) {
    return await crypt.en(tokenizeObject, this.getFirstKey())
  }

  async __generateNewTokenUsingLastKey (tokenizeObject) {
    return await crypt.en(tokenizeObject, this.__keys[this.__keys.length - 1].key)
  }

  getFirstKey () {
    return this.__keys[0].key
  }

  shiftAKey (newKey, created) {
    let newKeys = [{key: newKey, created}]
    for (let i = 0; i < this.__keys.length - 1; i++) {
      newKeys.push(this.__keys[i])
    }
    this.__keys = newKeys
  }

  addNewKey (keyToAdd) {
    let newKeys = [keyToAdd]
    newKeys.push.apply(newKeys, this.__keys)
    this.__keys = newKeys
  }

  getKeys () {
    return this.__keys
  }

  getLastInserted () {
    if (this.__keys.length > 0) {
      return this.__getLastKey().created
    } else {
      return null
    }
  }

  __getLastKey () {
    return this.__keys[this.__keys.length - 1]
  }

}

module.exports = {
  KeyStore
}
