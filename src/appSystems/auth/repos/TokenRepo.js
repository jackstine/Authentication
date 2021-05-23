const {v4: uuid4} = require('uuid')
const {KeyStore} = require('../models/KeyStore')

class TokenRepo {
  /**
   * @param numOfKeys
   * @param timeLimit
   */
  constructor(options) {
    options = options | {}
    if (!options.plugin) {
      throw Error(`There is no plugin for the package`)
    }
    // TODO make sure that the options contains info about the how long and how many
    this.MAX_COUNT = options.numOfKeys | 10
    this.__keys = undefined
    this.__keyStore = undefined
    // hours minutes seconds miliseconds
    let ONE_DAY = 1000 * 60 * 60 * 24
    this.TIME_LIMIT = options.timeLimit | ONE_DAY
    this.__lastInsertTimestamp = undefined
  }

  /**
   * THIS IS THE ONLY PUBLIC METHOD
   * will get the keys,
   * if overtimelimit, will insert a new key
   * MUST RETURN __keyOnly
   */
  async getKeyStore() {
    await this.__getAllKeys()
    if (await this.__overTimeLimit()) {
      await this.__insertKey()
    }
    return this.__keyStore
  }

  async __getAllKeys() {
    if (!this.__keys) {
      this.__keys = await this.plugin.returnAllKeysFromRepo()
      this.__keys.sort((a,b) => {
        if (a.created > b.created) {
          return 1
        } else if (a.created < b.created) {
          return -1
        } else {
          return 0
        }
      })
      this.__keyStore = new KeyStore(this.__keys.map(el => el.key).reverse())
    }
    return this.__keys
  }

  /**
   * will get the keys
   * returns the count of the keys
   */
  async __getCount () {
    if (!this.__keys) {
      await this.get()
    }
    return this.__keys.length
  }

  /**
   * will insert a new key
   * if over the max count will delete the oldest key
   */
  async __insertKey() {
    let count = await this.__getCount()
    let key = uuid4()
    if (count >= this.MAX_COUNT) {
      // FUTURE SECURITY_LOW delete all the oldest making sure that only MAX_COUNT - 1 remain
      await this.plugin.deleteTheOldestKey()
      this.__keys = this.__keys.slice(1)
      this.__keyStore.sliceAKey(key)
    }
    let newKey = await this.plugin.insertNewKey(key, new Date())
    this.__keys.push(newKey)
  }

  /**
   * must come after __getAllKeys()
   */
  async __overTimeLimit() {
    let lastInsert = await this.__timeFromLastInsert()
    // add the time to the thing
    let nextInsert = new Date().setTime(lastInsert.getTime() + this.TIME_LIMIT)
    return new Date() > new Date(nextInsert)
  }

  async __timeFromLastInsert() {
    return this.__keys[0].created
  }
}

module.exports = TokenRepo
