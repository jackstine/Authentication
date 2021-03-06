const { v4: uuid4 } = require("uuid");
const { KeyStore } = require("../models/KeyStore");

class TokenRepo {
  /**
   * @param numOfKeys
   * @param timeLimit
   */
  constructor(options) {
    if (!options.plugin) {
      throw Error(`There is no plugin for the package`);
    }
    this.MAX_COUNT = options.keyStore.keyCount;
    this.__keys = undefined;
    this.__keyStore = undefined;
    this.TIME_LIMIT = options.keyStore.timeLimit;
    this.__lastInsertTimestamp = undefined;
    this.plugin = options.plugin;
  }

  /**
   * THIS IS THE ONLY PUBLIC METHOD
   * will get the keys,
   * if overtimelimit, will insert a new key
   * MUST RETURN __keyOnly
   */
  async getKeyStore() {
    await this.__getAllKeys();
    if (await this.__overTimeLimit()) {
      await this.__insertKey();
    }
    return this.__keyStore;
  }

  async generateNewToken(userObject) {
    let keyStore = await this.getKeyStore();
    // TODO need to convert userObject to a slimmer version
    let newToken = await keyStore.generateNewToken(userObject);
    return {
      token: newToken,
      expires: await this.__timeRemaining(),
    };
  }

  async authenticateToken(token) {
    let keyStore = await this.getKeyStore();
    return await keyStore.checkToken(token);
  }

  async __getAllKeys() {
    if (!this.__keyStore) {
      let keys = await this.plugin.returnAllKeysFromRepo();
      keys.sort((a, b) => {
        if (a.created > b.created) {
          return 1;
        } else if (a.created < b.created) {
          return -1;
        } else {
          return 0;
        }
      });
      this.__keyStore = new KeyStore(
        keys
          .map((el) => {
            return { key: el.key, created: el.created };
          })
          .reverse()
      );
    }
    return this.__keyStore.getKeys();
  }

  /**
   * will get the keys
   * returns the count of the keys
   */
  async __getCount() {
    if (!this.__keyStore) {
      await this.get();
    }
    return this.__keyStore.getKeys().length;
  }

  /**
   * will insert a new key
   * if over the max count will delete the oINSERT NEW KEYldest key
   */
  async __insertKey() {
    let count = await this.__getCount();
    let key = uuid4();
    let timestamp = new Date();
    if (count >= this.MAX_COUNT) {
      // FUTURE SECURITY_LOW delete all the oldest making sure that only MAX_COUNT - 1 remain
      await this.plugin.deleteTheOldestKey();
      this.__keyStore.shiftAKey(key, timestamp);
    } else {
      this.__keyStore.addNewKey({ key, created: timestamp });
    }
    let newKey = await this.plugin.insertNewKey(key, timestamp);
  }

  /**
   * must come after __getAllKeys()
   */
  async __overTimeLimit() {
    let lastInsert = await this.__timeFromLastInsert();
    if (lastInsert) {
      // add the time to the thing
      let nextInsert = new Date().setTime(lastInsert.getTime() + this.TIME_LIMIT);
      return new Date() > new Date(nextInsert);
    } else {
      return true;
    }
  }

  async __timeRemaining() {
    let lastInsert = await this.__timeFromLastInsert();
    if (lastInsert) {
      let nextInsert = new Date().setTime(lastInsert.getTime() + this.TIME_LIMIT);
      return nextInsert - new Date().getTime();
    } else {
      return this.TIME_LIMIT;
    }
  }

  async __timeFromLastInsert() {
    return this.__keyStore.getLastInserted();
  }
}

module.exports = TokenRepo;
