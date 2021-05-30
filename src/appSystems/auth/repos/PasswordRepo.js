const CRYPT = require('../../../common/crypt')
const {v4: uuid4} = require('uuid')

class PasswordRepo {
  constructor(options) {
    if (!options.plugin) {
      throw Error('there is no plugin')
    }
    this.plugin = options.plugin
  }

  async insert(user_id, password) {
    let key = uuid4()
    let encryptedPassword = await CRYPT.crypt.en(password, key)
    return this.plugin.insertPassword({user_id, password: encryptedPassword, key})
  }

  async update (id, oldPassword, newPassword) {
    if (await this.checkPassword(id, oldPassword)) {
      return await this.__OverrideUpdatePasswordNeverUseOnlyDireSituations(id, newPassword)
    }
  }

  async deletePassword (id, password) {
    if (await this.checkPassword(id, password)) {
      return this.plugin.deletePasswordById(id)
    }
  }

  async __OverrideUpdatePasswordNeverUseOnlyDireSituations (id, newPassword) {
    let key = uuid4()
    let encryptedPassword = await CRYPT.crypt.en(newPassword, key)
    return this.plugin.updatePasswordOnlyShouldBeUsedOnce({id, password: encryptedPassword, key}).then(resp => {
      return true
    })
  }

  async checkPassword (id, password) {
    let data = await this.plugin.getPasswordForId(id)
    if (data) {
      try {
        return password === await CRYPT.crypt.de(data.password, data.key)
      } catch (ex) {
        // ignore, just send false
      }
    }
    return false
  }
}

module.exports = PasswordRepo
