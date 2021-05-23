module.exports = {
  TemporaryPasswordRepo: {
    async insertNewUserIdAndPassword(userid, newRandomPassword) {
      let functionName = 'insertNewUserIdAndPassword'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    async selectTemporaryPasswordById() {
      let functionName = 'selectTemporaryPasswordById'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    async deleteAllOldTempPasswords () {
      let functionName = 'deleteAllOldTempPasswords'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    async deleteTempPassword (id) {
      let functionName = 'deleteTempPassword'
      throw Error(`The plugin function ${functionName} is not implemented`)
    }
  },
  TokenRepo: {
    async returnAllKeysFromRepo() {
      let functionName = 'returnAllKeysFromRepo'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    async deleteTheOldestKey() {
      let functionName = 'deleteTheOldestKey'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    async insertNewKey (key, dateCreated) {
      let functionName = 'insertNewKey'
      throw Error(`The plugin function ${functionName} is not implemented`)
    }
  },
  UserRepo: {
    async getUserVerified (userId) {
      let functionName = 'getUserVerified'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    async verifyUser () {
      let functionName = 'verifyUser'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    async createUser({userId}) {
      let functionName = 'createUser'
      throw Error(`The plugin function ${functionName} is not implemented`)
    }
  },
  UserVerificationRepo: {
    async getVerificationCode () {
      let functionName = 'getVerificationCode'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    async createVerificationCode (userId, vc) {
      let functionName = 'createVerificationCode'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    async deleteVerificationCode(verificationCode) {
      let functionName = 'deleteVerificationCode'
      throw Error(`The plugin function ${functionName} is not implemented`)
    }
  },
  PasswordRepo: {
    async insertPassword({id, password, key}) {
      let functionName = 'insertPassword'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    async deletePasswordById (id) {
      let functionName = 'deletePasswordById'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    async updatePasswordOnlyShouldBeUsedOnce (id, password, key) {
      let functionName = 'updatePasswordOnlyShouldBeUsedOnce'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    async getPasswordForId (id) {
      let functionName = 'getPasswordForId'
      throw Error(`The plugin function ${functionName} is not implemented`)
    }
  }
}