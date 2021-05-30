const {v4: uuid4} = require('uuid')

class UserVerificationRepo {
  constructor(options) {
    if (!options.plugin) {
      throw Error('There is no plugin')
    }
    this.plugin = options.plugin
  }

  async getVerificationCode (verificationCode) {
    verificationCode =  await this.plugin.getVerificationCode(verificationCode)
    if (verificationCode) {
      if (!verificationCode.user_id) {
        throw Error('plugin UserVerificationRepo getVerificationCode() must return object with an attribute of "user_id"')
      }
      if (!verificationCode.verification_code) {
        throw Error('plugin UserVerificationRepo getVerificationCode() must return object with an attribute of "verification_code"')
      }
      return verificationCode
    }
    return false
  }

  async createVerificationCode (user_id) {
    let vc = uuid4()
    let verificationCode = await this.plugin.createVerificationCode(user_id.toLowerCase(), vc)
    if (!verificationCode.user_id) {
      throw Error('plugin UserVerificationRepo createVerificationCode() must return object with an attribute of "user_id"')
    }
    if (!verificationCode.verification_code) {
      throw Error('plugin UserVerificationRepo createVerificationCode() must return object with an attribute of "verification_code"')
    }
    return verificationCode
  }

  async delete(verificationCode) {
    return await this.plugin.deleteVerificationCode(verificationCode)
  }
}

module.exports = UserVerificationRepo
