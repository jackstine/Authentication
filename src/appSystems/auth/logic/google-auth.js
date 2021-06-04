const {OAuth2Client} = require('google-auth-library');

const google = {
  client: null,
  setup: async function (clientId) {
    this.googleClientId = clientId
    this.client = new OAuth2Client(this.googleClientId);
  },
  verify: async function (token) {
    if (!this.client) {
      throw Error('the client has not be initiated with the clientId using setup() for google verify')
    }
    const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.googleClientId
    });
    try {
      const payload = ticket.getPayload();
      let hasClientId = payload.aud === this.googleClientId
      let hasISS = payload.iss === 'accounts.google.com' || payload.iss === 'https://accounts.google.com'
      let hasNotExpired = new Date(payload.exp * 1000) > new Date()
      // locale -- language
      // picture -- location of google image
      let user = {
        first_name: payload.given_name,
        last_name: payload.family_name,
        email: payload.email
      }
      let success = hasClientId && hasISS && hasNotExpired && payload.email_verified
      return {success, user}
    } catch (ex) {
      console.error(ex)
      return {success: false}
    }
  }
}

module.exports = {
  google
}