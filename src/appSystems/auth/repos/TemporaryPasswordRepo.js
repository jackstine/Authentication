const CRYPT = require('../../../common/crypt')

class TemporaryPasswordRepo {
  constructor({plugin, options}) {
    this.plugin = plugin
    this.TIME_LIMIT = options.tempPasswordLifetime
  }
  async createTempPassword (user_id) {
    let newRandomPassword = CRYPT.generateRandomString(10)
    let tempPassword = await this.plugin.insertNewUserIdAndPassword(user_id.toLowerCase(), newRandomPassword, new Date())
    if (!tempPassword.user_id) {
      throw Error('plugin TemporaryPasswordRepo insertNewUserIdAndPassword() must return object with an attribute of "user_id"')
    }
    tempPassword.expiresIn = this.TIME_LIMIT
    return tempPassword
  }

  async verifyTemporyPassword (id, password) {
    let data = await this.plugin.selectTemporaryPasswordById(id.toLowerCase())
    if (data) {
      return this.__withinTimeLimit(data.created) && data.password === password
    } else {
      return false
    }
  }

  async deleteAllOldTempPasswords () {
    await this.plugin.deleteAllOldTempPasswords(this.TIME_LIMIT)
  }

  async delete (id) {
    return await this.plugin.deleteTempPassword(id.toLowerCase()).then(resp => {
      return true
    })
  }

  __withinTimeLimit (createdTimestamp) {
    let timeLimit = new Date().setTime(new Date(createdTimestamp).getTime() + this.TIME_LIMIT)
    let now = new Date()
    return timeLimit > now
  }
}

module.exports = TemporaryPasswordRepo
