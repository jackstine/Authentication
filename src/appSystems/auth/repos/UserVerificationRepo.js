const { v4: uuid4 } = require("uuid");

class UserVerificationRepo {
  constructor(options) {
    if (!options.plugin) {
      throw Error("There is no plugin");
    }
    this.plugin = options.plugin;
  }

  async getVerificationCode(verificationCode) {
    verificationCode = await this.plugin.getVerificationCode(verificationCode);
    if (verificationCode) {
      if (!verificationCode.email) {
        throw Error(
          'plugin UserVerificationRepo getVerificationCode() must return object with an attribute of "email"'
        );
      }
      if (!verificationCode.verification_code) {
        throw Error(
          'plugin UserVerificationRepo getVerificationCode() must return object with an attribute of "verification_code"'
        );
      }
      return verificationCode;
    }
    return false;
  }

  async createVerificationCode(email) {
    let vc = uuid4();
    let verificationCode = await this.plugin.createVerificationCode(email.toLowerCase(), vc);
    if (!verificationCode.email) {
      throw Error(
        'plugin UserVerificationRepo createVerificationCode() must return object with an attribute of "email"'
      );
    }
    if (!verificationCode.verification_code) {
      throw Error(
        'plugin UserVerificationRepo createVerificationCode() must return object with an attribute of "verification_code"'
      );
    }
    return verificationCode;
  }

  async delete(verificationCode) {
    return await this.plugin.deleteVerificationCode(verificationCode);
  }
}

module.exports = UserVerificationRepo;
