let temporaryPasswordRepo = [];
let tokenRepo = [];
let userRepo = [];
let userVerificationRepo = [];
let passwordRepo = [];

module.exports = {
  TemporaryPasswordRepo: {
    async insertNewUserIdAndPassword(email, newRandomPassword, createdTimestamp) {
      let record = { email, password: newRandomPassword, created: createdTimestamp };
      temporaryPasswordRepo.push(record);
      return record;
    },
    async selectTemporaryPasswordById(email) {
      return temporaryPasswordRepo.find((el) => el.email === email);
    },
    async deleteAllOldTempPasswords(timesUpLimit) {
      temporaryPasswordRepo = temporaryPasswordRepo.filter((el) => {
        return el.createdTimestamp >= timesUpLimit;
      });
    },
    async deleteTempPassword(email) {
      temporaryPasswordRepo = temporaryPasswordRepo.filter((el) => el.email !== email);
      return true;
    },
  },
  TokenRepo: {
    async returnAllKeysFromRepo() {
      return tokenRepo;
    },
    async deleteTheOldestKey() {
      tokenRepo = tokenRepo.slice(1, tokenRepo.length);
    },
    async insertNewKey(key, created) {
      let record = { key, created };
      tokenRepo.push(record);
      return record;
    },
  },
  UserRepo: {
    async getUserIsVerified(email) {
      return userRepo.filter((el) => el.email === email).map((el) => el.verified)[0];
    },
    async verifyUser(email) {
      let user = userRepo.filter((el) => el.email === email)[0];
      user.verified = true;
      return user;
    },
    async createUser(user) {
      let record = { email: user.email, verified: false };
      userRepo.push(record);
      return record;
    },
    async getUser(user) {
      let users = userRepo.filter((el) => el.email === user);
      return users[0] ?? null;
    },
    async updateUser(userInfo) {
      let update = false;
      for (let i in userRepo) {
        let u = userRepo[i];
        if (u.email === userInfo.email) {
          update = true;
          userRepo[i] = { ...u, ...userInfo };
        }
      }
      return update;
    },
  },
  UserVerificationRepo: {
    async getVerificationCode(verification_code) {
      let record = userVerificationRepo.filter((el) => el.verification_code === verification_code);
      return record.length === 1 ? record[0] : null;
    },
    async createVerificationCode(email, vc) {
      let record = { email, verification_code: vc };
      userVerificationRepo.push(record);
      return record;
    },
    async deleteVerificationCode(verification_code) {
      let indexToDelete = userVerificationRepo.findIndex(
        (el) => el.verification_code === verification_code
      );
      userVerificationRepo.splice(indexToDelete);
    },
  },
  PasswordRepo: {
    async insertPassword({ email, password, key }) {
      let record = { email, password, key };
      passwordRepo.push(record);
      return record;
    },
    async deletePasswordById(email) {
      let indexOfPassword = passwordRepo.findIndex((el) => el.email === email);
      passwordRepo.splice(indexOfPassword, 1);
    },
    async updatePasswordOnlyShouldBeUsedOnce(email, password, key) {
      let record = passwordRepo.filter((el) => el.email === email);
      if (record.length === 1) {
        record.password = password;
        record.key = key;
      }
    },
    async getPasswordForId(email) {
      let record = passwordRepo.filter((el) => el.email === email);
      return record[0];
    },
  },
  reset() {
    temporaryPasswordRepo = [];
    tokenRepo = [];
    userRepo = [];
    userVerificationRepo = [];
    passwordRepo = [];
  },
};
