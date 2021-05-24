const CRYPT = require('../../../common/crypt')

class TemporaryPasswordRepo {
  constructor({plugin, options}) {
    this.plugin = plugin
    this.TIME_LIMIT = options.tempPasswordLifetime
  }
  async createTempPassword (userid) {
    let newRandomPassword = CRYPT.generateRandomString(10)
    let tempPassword = await this.plugin.insertNewUserIdAndPassword(userid.toLowerCase(), newRandomPassword, new Date())
    tempPassword.expiresIn = this.TIME_LIMIT
    return tempPassword
  }

  async verifyTemporyPassword (id, password) {
    let data = await this.plugin.selectTemporaryPasswordById(id.toLowerCase())
    return this.__withinTimeLimit(data.created) && data.password === password
  }

  async deleteAllOldTempPasswords () {
    await this.plugin.deleteAllOldTempPasswords(this.TIME_LIMIT)
  }

  async delete (id) {
    await this.plugin.deleteTempPassword(id.toLowerCase())
  }

  __withinTimeLimit (createdTimestamp) {
    let timeLimit = new Date().setTime(new Date(createdTimestamp).getTime() + this.TIME_LIMIT)
    let now = new Date()
    return timeLimit > now
  }
}

module.exports = TemporaryPasswordRepo
