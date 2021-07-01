const { createToken } = require("../../../../appSystems/auth/logic/token");
const { createUsers } = require("../../../../appSystems/auth/logic/users");
const { tokenMock, usersMock } = require("../../../mocks");
const MockPlugin = require("../../../../plugins/pluginMock");
let chai = require("chai");
const users = require("../../../../appSystems/auth/logic/users");
let expect = chai.expect;
chai.should();

let userInfo = {
  firstName: "jacob",
  lastName: "cukjati",
  username: "jacobCukjati@gmail.com",
  email: "jacobCukjati@gmail.com",
  phone: "8503616563",
  password: "password",
};
let cloneUserInfo = { ...userInfo };
let vc = "d4a2435d-9287-414c-aee7-824d5527e1d7";
let token = null;
let addToAddToToken = {customerId: 'cust-12232', dogId: 'doggo'}

describe("Token", function () {
  before(function (done) {
    token = createToken({ ...tokenMock, googleClientId: process.env.GOOGLE_CLIENT_ID });
    MockPlugin.reset();
    done();
  });

  describe("#generateToken", function () {
    it("should generate a token", function (done) {
      createUsers({ ...usersMock })
        .createUserVerificationAndPassword(userInfo)
        .then((resp) => {
          token
            .generateToken(userInfo.email)
            .then((generatedAuthToken) => {
              expect(generatedAuthToken.token).to.be.an("string");
              expect(generatedAuthToken.expires).to.be.an("number");
              done();
            })
            .catch(console.error);
        });
    });
    it("should be able to add to token", function (done) {
      userInfo.password = cloneUserInfo.password
      createUsers({ ...usersMock })
        .createUserVerificationAndPassword(userInfo)
        .then((resp) => {
          token
            .generateToken(userInfo.email, addToAddToToken)
            .then(async (generatedAuthToken) => {
              let auth = await token.authenticateToken(generatedAuthToken.token)
              expect(generatedAuthToken.token).to.be.an("string");
              expect(generatedAuthToken.expires).to.be.an("number");
              expect(auth.success).to.be.equal(true)
              expect(auth.data.customerId).to.equal(addToAddToToken.customerId)
              expect(auth.data.dogId).to.equal(addToAddToToken.dogId)
              done();
            })
            .catch(console.error);
        }).catch(console.error);
    });
    
    it("should fail when a undefined or null is inserted", function (done) {
      token.generateToken(null).catch((err) => {
        expect(err.message).to.be.a("string");
        done();
      });
    });
  });
  describe("#authenticateToken", function () {
    it("it should authenticate the user", function (done) {
      token
        .generateToken(userInfo.email)
        .then(async (generatedAuthToken) => {
          expect(generatedAuthToken.token).to.be.an("string");
          let auth = await token.authenticateToken(generatedAuthToken.token);
          auth.success.should.be.equal(true);
          auth.data.email.should.be.equal(userInfo.email);
          done();
        })
        .catch(console.error);
    });
    it("it should return false on false authentication", function (done) {
      token
        .generateToken(userInfo.email)
        .then(async (generatedAuthToken) => {
          expect(generatedAuthToken.token).to.be.an("string");
          let auth = await token.authenticateToken(generatedAuthToken.token);
          auth.success.should.be.equal(true);
          auth.data.email.should.be.equal(userInfo.email);
          let authResp = await token.authenticateToken(
            "eyJhbGciOiJIUzI1NiJ9.bmFtZUByYWVtaXN0ZW1haWwuY29t.d5qu_8bzMwhWygglDWKbY9n4daCYbnbR4w-enghUI5c"
          );
          expect(authResp).to.be.equal(false);
          done();
        })
        .catch(console.error);
    });
  });
  describe("#login", function () {
    it("should login the user", function (done) {
      userInfo = { ...cloneUserInfo };
      let email = userInfo.email;
      let password = userInfo.password;
      let users = createUsers({ ...usersMock });
      users
        .createUserVerificationAndPassword(userInfo)
        .then(async (userVerification) => {
          let loginResponse = await token.login(email, password, addToAddToToken); 
          let lu = loginResponse.user;
          expect(loginResponse.success).to.be.equal(true);
          expect(loginResponse.token.token).to.be.a("string");
          expect(loginResponse.token.expires).to.be.a("number");
          expect(lu.email).to.be.equal(email.toLowerCase());
          expect(lu.verified).to.be.equal(false);
          loginResponse = await token.login(email, password, {hello: "world"});
          expect(loginResponse.token.token).to.be.a("string");
          done();
        })
        .catch(console.error);
    }); // END OF IT
    it("should recognize that the user used forgotten password", function (done) {
      userInfo.password = "password";
      let users = createUsers({ ...usersMock });
      users
        .createUserVerificationAndPassword(userInfo)
        .then((userVerification) => {
          users
            .forgotPassword(userInfo.email)
            .then(async (userInfoTempPassword) => {
              let loginResponse = await token.login(userInfo.email, userInfoTempPassword.password);
              expect(loginResponse.success).to.be.equal(true);
              expect(loginResponse.verifiedWithTemporary).to.be.equal(true);
              done();
            })
            .catch(console.error);
        })
        .catch(console.error);
    }); //END OF IT
    it("should return false if the password is not valid", function (done) {
      userInfo.password = "password";
      let users = createUsers({ ...usersMock });
      users
        .createUserVerificationAndPassword(userInfo)
        .then((userVerification) => {
          users
            .forgotPassword(userInfo.email)
            .then(async (userInfoTempPassword) => {
              let loginResponse = await token.login(userInfo.email, null);
              expect(loginResponse.success).to.be.equal(false);
              done();
            })
            .catch(console.error);
        })
        .catch(console.error);
    }); //END OF IT
    it("should return false if the user is null", function (done) {
      userInfo.password = "password";
      let users = createUsers({ ...usersMock });
      users
        .createUserVerificationAndPassword(userInfo)
        .then((userVerification) => {
          users
            .forgotPassword(userInfo.email)
            .then(async (userInfoTempPassword) => {
              let loginResponse = await token.login(null, null);
              expect(loginResponse.success).to.be.equal(false);
              done();
            })
            .catch(console.error);
        })
        .catch(console.error);
    }); //END OF IT
    it("should return false if the user does not exist", function (done) {
      userInfo.password = "password";
      let users = createUsers({ ...usersMock });
      users
        .createUserVerificationAndPassword(userInfo)
        .then((userVerification) => {
          users
            .forgotPassword(userInfo.email)
            .then(async (userInfoTempPassword) => {
              let loginResponse = await token.login("garjack", "crap");
              expect(loginResponse.success).to.be.equal(false);
              done();
            })
            .catch(console.error);
        })
        .catch(console.error);
    }); //END OF IT
  });
  describe("#googleSignin", function () {
    it("should sign in the user", function (done) {
      expect(token.googleSignin).to.be.a("function");
      done();
    });
  });
});
