class UserRepo {
  constructor(options) {
    if (!options.plugin) {
      throw Error('there is no plugin')
    }
    this.plugin = options.plugin
  }

  /**
   * 
   * @param {*} user 
   */
  async createUser(user) {
    if (!user.user_id) {
      throw Error('must contain user_id attribute in user Object')
    }
    user.user_id = user.user_id.toLowerCase()
    user = await this.plugin.createUser(user)
    if (!user.user_id) {
      throw Error('plugin UserRepo createUser() must return object with an attribute of "user_id"')
    }
    return user
  }

  async userIsVerified (user_id) {
    return this.plugin.getUserIsVerified(user_id.toLowerCase())
  }

  async verifyUser (user_id) {
    return this.plugin.verifyUser(user_id.toLowerCase())
  }

  async getUser (user_id) {
    return this.plugin.getUser(user_id.toLowerCase())
  }
}

module.exports = UserRepo
