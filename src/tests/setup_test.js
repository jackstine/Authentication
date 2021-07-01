

before(function (done) {
  // set UTC as default timezone
  process.env.TZ="UTC"
  require('dotenv').config()
  process.on('unhandledRejection', (exception) => {
    console.error(exception)
  })
  done()
})

after(function (done) {
  done()
})
