const env = process.env.AUTH_ENV
require('dotenv').config()
const config = require('./config.' + env)
module.exports = config;
