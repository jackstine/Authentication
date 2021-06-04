

before(function (done) {
  // set UTC as default timezone
  process.env.TZ="UTC"
  require('dotenv').config()
  done()
})

after(function (done) {
  done()
})
