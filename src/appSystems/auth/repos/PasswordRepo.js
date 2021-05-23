const CRYPT = require('../../../common/crypt')
const {v4: uuid4} = require('uuid')

class PasswordRepo {
  constructor(options) {
    if (options.plugin) {
      throw Error('there is no plugin')
    }
    this.plugin = plugin
  }

  async insert(userId, password) {
    let key = uuid4()
    let encryptedPassword = await CRYPT.crypt.en(password, key)
    return this.plugin.insertPassword({id, password: encryptedPassword, key})
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
    return this.plugin.updatePasswordOnlyShouldBeUsedOnce({id, password: encryptedPassword, key})
  }

  async checkPassword (id, password) {
    let data = await this.plugin.getPasswordForId(id)
    if (data.key) {
      return password === await CRYPT.crypt.de(data.password, data.key)
    } else {
      return data.password === password
    }
  }
}

// TODO set the new
module.exports = PasswordRepo
