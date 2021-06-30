const Bluebird = require("bluebird");

module.exports = {
  /**
   *
   * @param options.plugin
   * @param options.repos
   * @param options.keyStore
   * @param options.tokenize -- this is a async function that returns data to be added to the token
   * @param options.googleClientId
   */
  createToken: function (options) {
    if (!options.plugin) {
      throw Error(`plugin does not exist for Users Logic`);
    }
    this.plugin = options.plugin;
    for (let plugin of ["PasswordRepo", "UserRepo", "TokenRepo", "TemporaryPasswordRepo"]) {
      if (!this.plugin[plugin]) {
        throw Error(`Object "${plugin}" does not exist in plugin`);
      }
    }
    return {
      repos: options.repos,
      keyStore: options.keyStore,
      tokenize: options.tokenize,
      passwordRepo: options.repos.passwordRepo,
      userRepo: options.repos.userRepo,
      tokenRepo: options.repos.tokenRepo,
      temporaryPasswordRepo: options.repos.temporaryPasswordRepo,
      userVerificationRepo: options.repos.userVerificationRepo,
      google: require("./google-auth").google,
      googleClientId: options.googleClientId,
      /**
       *
       * @param {string} userObject.email
       * @param {*} userObject[anything]
       */
      generateToken: async function (userObject) {
        if (userObject) {
          let isObject = typeof userObject === "object" && userObject !== null;
          if (!isObject) {
            userObject = { email: userObject };
          }
          // the tokenize() method is a plugin that return any data 
          // that will spread into the token
          let user = await Promise.all([
            await this.userRepo.getUser(userObject.email),
            await this.tokenize()
          ])
          if (user) {
            let u = user[0]
            let t = user[1]
            return await this.tokenRepo.generateNewToken({...u, ...t});
          }
        }
        throw Error("The Email does not exist, we cannot make a user");
      },
      /**
       *
       * @param {*} token
       */
      authenticateToken: async function (token) {
        try {
          return await this.tokenRepo.authenticateToken(token);
        } catch (ex) {
          return false;
        }
      },
      /**
       *
       * @param {*} email
       * @param {*} password
       */
      login: async function (email, password, addToToken) {
        if (email && password) {
          let passwordResult = await this.passwordRepo.checkPassword(email, password);
          if (passwordResult) {
            let user = await this.userRepo.getUser(email)
            let token = await this.generateToken({user, ...addToToken})
            return { success: true, token, user };
          } else {
            let isForgottenPassword = await this.temporaryPasswordRepo.verifyTemporyPassword(
              email,
              password
            );
            if (isForgottenPassword) {
              return { success: true, verifiedWithTemporary: true };
            }
          }
        }
        return { success: false };
      },
      /**
       *
       * @param {*} token
       * @returns
       */
      googleSignin: async function (token) {
        this.google.setup(this.googleClientId);
        let result = await this.google.verify(token);
        if (result.success) {
          let user = result.user;
          user.email = user.email;
          let email = user.email;
          let userExists = await this.userRepo.getUser(email);
          if (!userExists) {
            let userData = await Bluebird.props({
              success: true,
              is_new_user: true,
              user: this.userRepo.createUser(user),
              verification: this.userVerificationRepo.createVerificationCode(email),
              token: this.tokenRepo.generateNewToken(user),
            });
            return userData;
          } else {
            return await Bluebird.props({
              success: true,
              is_new_user: false,
              user: user,
              token: this.tokenRepo.generateNewToken(user),
            });
          }
        } else {
          return { success: false };
        }
      }, // START OF NEXT FUNCTION
    }; // END OF OBJECT
  }, // END OF CREATE FUNCTION
}; // END OF MODULE EXPORT
