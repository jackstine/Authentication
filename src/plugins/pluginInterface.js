module.exports = {
  TemporaryPasswordRepo: {
    async insertNewUserIdAndPassword(userid, newRandomPassword, createdTimestamp) {
      let functionName = 'insertNewUserIdAndPassword'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    async selectTemporaryPasswordById(userid) {
      let functionName = 'selectTemporaryPasswordById'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    async deleteAllOldTempPasswords (timesUpLimit) {
      let functionName = 'deleteAllOldTempPasswords'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    async deleteTempPassword (userid) {
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
    /**
     * 
     * @param {*} key 
     * @param {*} created 
     * @param {key, created}
     */
    async insertNewKey (key, created) {
      let functionName = 'insertNewKey'
      throw Error(`The plugin function ${functionName} is not implemented`)
    }
  },
  UserRepo: {
    async getUserIsVerified (userId) {
      let functionName = 'getUserIsVerified'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    async verifyUser (userId) {
      let functionName = 'verifyUser'
      throw Error(`The plugin function ${functionName} is not implemented`)
    },
    /**
     * required to have userId
     * @param {*} user 
     */
    async createUser(user) {
      let functionName = 'createUser'
      throw Error(`The plugin function ${functionName} is not implemented`)
    }
  },
  UserVerificationRepo: {
    async getVerificationCode (verificationCode) {
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
    async insertPassword({userId, password, key}) {
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