class UserRepo {
  constructor(options) {
    if (!options.plugin) {
      throw Error("there is no plugin");
    }
    this.plugin = options.plugin;
  }

  /**
   *
   * @param {string} user.email
   * @param {*} user[anything]
   */
  async createUser(user) {
    if (!user.email) {
      throw Error("must contain email attribute in user Object");
    }
    user.email = user.email.toLowerCase();
    user = await this.plugin.createUser(user);
    if (!user.email) {
      throw Error('plugin UserRepo createUser() must return object with an attribute of "email"');
    }
    return user;
  }

  async userIsVerified(email) {
    return this.plugin.getUserIsVerified(email.toLowerCase());
  }

  async verifyUser(email) {
    return this.plugin.verifyUser(email.toLowerCase());
  }

  async getUser(email) {
    if (email) {
      return this.plugin.getUser(email.toLowerCase());
    } else {
      return null;
    }
  }

  async updateUser(userInfo) {
    userInfo.email = userInfo.email.toLowerCase();
    return this.plugin.updateUser(userInfo);
  }
}

module.exports = UserRepo;
