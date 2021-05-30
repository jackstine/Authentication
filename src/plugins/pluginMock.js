let temporaryPasswordRepo = []
let tokenRepo = []
let userRepo = []
let userVerificationRepo = []
let passwordRepo = []

module.exports = {
  TemporaryPasswordRepo: {
    async insertNewUserIdAndPassword(user_id, newRandomPassword, createdTimestamp) {
      let record = {user_id, password: newRandomPassword, created: createdTimestamp}
      temporaryPasswordRepo.push(record)
      return record
    },
    async selectTemporaryPasswordById(user_id) {
      return temporaryPasswordRepo.find(el => el.user_id === user_id)
    },
    async deleteAllOldTempPasswords (timesUpLimit) {
      temporaryPasswordRepo = temporaryPasswordRepo.filter(el => {
        return el.createdTimestamp >= timesUpLimit
      })
    },
    async deleteTempPassword (user_id) {
      temporaryPasswordRepo = temporaryPasswordRepo.filter(el => el.user_id !== user_id)
      return true
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
    async getUserIsVerified (user_id) {
      return userRepo.filter(el => el.user_id === user_id).map(el => el.verified)[0]
    },
    async verifyUser (user_id) {
      let user =  userRepo.filter(el => el.user_id === user_id)[0]
      user.verified = true
      return user
    },
    async createUser(user) {
      let record = {user_id: user.user_id, verified: false}
      userRepo.push(record)
      return record
    },
    async getUser (user) {
      let users = userRepo.filter(el => el.user_id === user)
      return users[0] ?? null
    }
  },
  UserVerificationRepo: {
    async getVerificationCode (verification_code) {
      let record = userVerificationRepo.filter(el => el.verification_code === verification_code)
      return record.length === 1 ? record[0] : null
    },
    async createVerificationCode (user_id, vc) {
      let record = {user_id, verification_code: vc}
      userVerificationRepo.push(record)
      return record
    },
    async deleteVerificationCode(verification_code) {
      let indexToDelete = userVerificationRepo.findIndex(el => el.verification_code === verification_code)
      userVerificationRepo.splice(indexToDelete)
    }
  },
  PasswordRepo: {
    async insertPassword({user_id, password, key}) {
      let record = {user_id, password, key}
      passwordRepo.push(record)
      return record
    },
    async deletePasswordById (user_id) {
      let indexOfPassword = passwordRepo.findIndex(el => el.user_id === user_id)
      passwordRepo.splice(indexOfPassword, 1)
    },
    async updatePasswordOnlyShouldBeUsedOnce (user_id, password, key) {
      let record = passwordRepo.filter(el => el.user_id === user_id)
      if (record.length === 1) {
        record.password = password
        record.key = key
      }
    },
    async getPasswordForId (user_id) {
      let record = passwordRepo.filter(el => el.user_id === user_id)
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

