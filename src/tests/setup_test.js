before(function (done) {
  // set UTC as default timezone
  process.env.TZ="UTC"
  done()
})

after(function (done) {
  try{
    const {CONNECTION} = require('../serverlogic/RDS')
    CONNECTION.close().then(resp => {
      done()
    })
  } catch(ex) {
    done()
  }
})
