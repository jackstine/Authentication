const CRYPT = require('../../../common/crypt')

class TemporaryPasswordRepo {
  constructor(plugin) {
    this.plugin = plugin
    this.MINUTES = 15
    this.TIME_LIMIT = 1000 * 60 * this.MINUTES
  }
  async createTempPassword (userid) {
    let newRandomPassword = CRYPT.generateRandomString(10)
    return await this.plugin.insertNewUserIdAndPassword(userid.toLowerCase(), newRandomPassword)
  }

  async verifyTemporyPassword (id, password) {
    let data = await this.plugin.selectTemporaryPasswordById(id.toLowerCase())
    return this.__withinTimeLimit(data.created) && data.password === password
  }

  async deleteAllOldTempPasswords () {
    await this.plugin.deleteAllOldTempPasswords()
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

// JAKE TODO need to implement new Object
module.exports = TemporaryPasswordRepo
