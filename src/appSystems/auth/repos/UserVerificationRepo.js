const {v4: uuid4} = require('uuid')

class UserVerificationRepo {
  constructor(options) {
    if (!options.plugin) {
      throw Error('There is no plugin')
    }
    this.plugin = options.plugin
  }

  async getVerificationCode (verificationCode) {
    return await this.plugin.getVerificationCode(verificationCode)
  }

  async createVerificationCode (userId) {
    let vc = uuid4()
    return await this.plugin.createVerificationCode(userId.toLowerCase(), vc)
  }

  async delete(verificationCode) {
    return await this.plugin.deleteVerificationCode(verificationCode)
  }
}

module.exports = UserVerificationRepo
