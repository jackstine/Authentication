class UserRepo {
  constructor(options) {
    if (!options.plugin) {
      throw Error('there is no plugin')
    }
    this.plugin = options.plugin
  }

  async createUser({userId}) {
    return this.plugin.createUser(userId.toLowerCase())
  }

  async userIsVerified (userId) {
    return this.plugin.getUserVerified(userId.toLowerCase())
  }

  // TODO this is causing conflict find a solution for it
  async verifyUser (userId) {
    return this.plugin.verifyUser(userId.toLowerCase())
  }
}

// TODO cover your UserRepo as new UR()
module.exports = UserRepo
