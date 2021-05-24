let temporaryPasswordRepo = []
let tokenRepo = []
let userRepo = []
let userVerificationRepo = []
let passwordRepo = []

module.exports = {
  TemporaryPasswordRepo: {
    async insertNewUserIdAndPassword(userId, newRandomPassword, createdTimestamp) {
      let record = {userId, password: newRandomPassword, created: createdTimestamp}
      temporaryPasswordRepo.push(record)
      return record
    },
    async selectTemporaryPasswordById(userId) {
      return temporaryPasswordRepo.find(el => el.userId === userId)
    },
    async deleteAllOldTempPasswords (timesUpLimit) {
      temporaryPasswordRepo = temporaryPasswordRepo.filter(el => {
        return el.createdTimestamp >= timesUpLimit
      })
    },
    async deleteTempPassword (userId) {
      temporaryPasswordRepo = temporaryPasswordRepo.filter(el => el.userId !== userId)
    }
  },
  TokenRepo: {
    async returnAllKeysFromRepo() {
      return tokenRepo
    },
    async deleteTheOldestKey() {
      tokenRepo = tokenRepo.slice(1, tokenRepo.length)
    },
    async insertNewKey (key, created) {
      let record = {key, created}
      tokenRepo.push(record)
      return record
    }
  },
  UserRepo: {
    async getUserIsVerified (userId) {
      return userRepo.filter(el => el.userId === userId).map(el => el.verified)[0]
    },
    async verifyUser (userId) {
      let user =  userRepo.filter(el => el.userId === userId)[0]
      user.verified = true
      return user
    },
    async createUser(user) {
      let record = {userId: user.userId, verified: false}
      userRepo.push(record)
      return record
    }
  },
  UserVerificationRepo: {
    async getVerificationCode (verificationCode) {
      let record = userVerificationRepo.filter(el => el.verificationCode === verificationCode)
      return record.length === 1 ? record[0] : null
    },
    async createVerificationCode (userId, vc) {
      let record = {userId, verificationCode: vc}
      userVerificationRepo.push(record)
      return record
    },
    async deleteVerificationCode(verificationCode) {
      let indexToDelete = userVerificationRepo.findIndex(el => el.verificationCode === verificationCode)
      userVerificationRepo.splice(indexToDelete)
    }
  },
  PasswordRepo: {
    async insertPassword({userId, password, key}) {
      let record = {userId, password, key}
      passwordRepo.push(record)
      return record
    },
    async deletePasswordById (userId) {
      let indexOfPassword = passwordRepo.findIndex(el => el.userId === userId)
      passwordRepo.splice(indexOfPassword, 1)
    },
    async updatePasswordOnlyShouldBeUsedOnce (userId, password, key) {
      let record = passwordRepo.filter(el => el.userId === userId)
      if (record.length === 1) {
        record.password = password
        record.key = key
      }
    },
    async getPasswordForId (userId) {
      let record = passwordRepo.filter(el => el.userId === userId)
      return record[0]
    }
  },
  reset () {
    temporaryPasswordRepo = []
    tokenRepo = []
    userRepo = []
    userVerificationRepo = []
    passwordRepo = []
  }
}

