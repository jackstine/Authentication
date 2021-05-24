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
    if (!user.userId) {
      throw Error('must contain userId attribute in user Object')
    }
    user.userId = user.userId.toLowerCase()
    return this.plugin.createUser(user)
  }

  async userIsVerified (userId) {
    return this.plugin.getUserIsVerified(userId.toLowerCase())
  }

  async verifyUser (userId) {
    return this.plugin.verifyUser(userId.toLowerCase())
  }
}

// TODO cover your UserRepo as new UR()
module.exports = UserRepo
