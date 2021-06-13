const Bluebird = require("bluebird");

module.exports = {
  /**
   *
   * @param {} options.plugin
   * @param {} options.repos
   * @returns
   */
  createUsers: function (options) {
    if (!options.plugin) {
      throw Error(`plugin does not exist for Users Logic`);
    }
    this.plugin = options.plugin;
    for (let plugin of [
      "UserVerificationRepo",
      "TemporaryPasswordRepo",
      "UserRepo",
      "PasswordRepo",
    ]) {
      if (!this.plugin[plugin]) {
        throw Error(`Object "${plugin}" does not exist in plugin`);
      }
    }

    return {
      plugin: options.plugin,
      options: options,
      repos: options.repos,
      userVerificationRepo: options.repos.userVerificationRepo,
      temporaryPasswordRepo: options.repos.temporaryPasswordRepo,
      userRepo: options.repos.userRepo,
      passwordRepo: options.repos.passwordRepo,
      tokenRepo: options.repos.tokenRepo,
      /**
       *
       * @param {string} userInfo.password
       * @param {string} userInfo.email
       */
      createUserVerificationAndPassword: async function (userInfo) {
        if (!userInfo.email) {
          throw Error("must contain email attribute in Object");
        }
        if (!userInfo.password) {
          throw Error("must contain password attribute in Object");
        }
        let password = userInfo.password;
        delete userInfo.password;
        let email = userInfo.email;
        let user = await this.userRepo.createUser(userInfo);
        // TODO need to change these calls
        let userData = await Bluebird.props({
          verification: this.userVerificationRepo.createVerificationCode(email),
          password: this.passwordRepo.insert(email, password),
          token: this.tokenRepo.generateNewToken(userInfo),
        });
        delete userData.password;
        return { ...userData, user };
      },

      /**
       *
       * @param {*} userInfo
       * @param {*} authToken
       * @returns
       */
      updateUser: async function (userInfo, authToken) {
        let result = { success: false };
        try {
          if (authToken) {
            let auth = await this.tokenRepo.authenticateToken(authToken);
            if (userInfo.email.toLowerCase() === auth.data.email.toLowerCase()) {
              let success = await this.userRepo.updateUser(userInfo);
              result = { success, user: userInfo };
            }
          }
        } catch (ex) {
          console.error(ex);
        }
        return result;
      },

      /**
       * @param {*} verificationCode
       * @return {Object} {verified}
       */
      verifyUser: async function (verificationCode) {
        let userVC = await this.userVerificationRepo.getVerificationCode(verificationCode);
        if (userVC) {
          await this.userVerificationRepo.delete(verificationCode);
          return await this.userRepo.verifyUser(userVC.email);
        } else {
          return { verified: false };
        }
      },

      /**
       *
       * @param {*} email
       * @param {*} tempPassword
       * @param {*} newPassword
       * @returns
       */
      resetPasswordFromTemporaryPassword: async function (email, tempPassword, newPassword) {
        try {
          let verifiedTempPassword = await this.temporaryPasswordRepo.verifyTemporyPassword(
            email,
            tempPassword
          );
          if (verifiedTempPassword) {
            let result = await Bluebird.props({
              temp: this.temporaryPasswordRepo.delete(email),
              newPassword: this.passwordRepo.__OverrideUpdatePasswordNeverUseOnlyDireSituations(
                email,
                newPassword
              ),
            });
            return result.newPassword && result.temp;
          } else {
            return false;
          }
        } catch (ex) {
          return false;
        }
      },

      /**
       *
       * @param {*} email
       * @returns
       */
      forgotPassword: async function (email) {
        try {
          let user = await this.userRepo.getUser(email);
          if (user) {
            let tempPassword = await this.temporaryPasswordRepo.createTempPassword(email);
            return tempPassword;
          } else {
            return null;
          }
        } catch (ex) {
          return null;
        }
      },

      /**
       *
       * @param {*} email
       * @returns
       */
      getUser: async function (email) {
        return await this.userRepo.getUser(email);
      },
    }; // END OF USERS OBJECT
  }, // END OF CREATE
}; // END OF MODULE
