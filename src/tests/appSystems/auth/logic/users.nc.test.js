const Users = require('../../../../appSystems/auth/logic/users')
require('chai').should()

let userInfo = {
  userId: 'jacobCukjati@gmail.com',
  password: 'password'
}
let vc = '3e5764ed-fa5a-4e40-be4e-fbe228d009d2'

describe('Users', function () {
  it('#createUser', function (done) {
    Users.createUser(userInfo).then(resp => {
      console.log(resp)
      done()
    })
  })
  it('#verifyUser', function (done) {
    Users.verifyUser(vc).then(resp => {
      console.log(resp)
      done()
    })
  })
})
