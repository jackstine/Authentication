const { createUsers } = require("../../../../appSystems/auth/logic/users");
const { createToken } = require("../../../../appSystems/auth/logic/token");
const { usersMock, tokenMock } = require("../../../mocks");
let chai = require("chai");
let expect = chai.expect;
chai.should();

let userInfo = {
  email: "jacobCukjati@gmail.com",
  password: "password",
  newPassword: "newPassword",
};
let userUpdateInfo = {
  email: userInfo.email,
  shirt: "large",
};
let userInfoClone = { ...userInfo };
let vc = "3e5764ed-fa5a-4e40-be4e-fbe228d009d2";
let users = createUsers({ ...usersMock });

describe("Users", function () {
  beforeEach((done) => {
    usersMock.plugin.reset();
    userInfo = { ...userInfoClone };
    users = createUsers({ ...usersMock });
    done();
  });
  describe("#createUserVerificationAndPassword", function () {
    it("it should create a user and their password", function (done) {
      users
        .createUserVerificationAndPassword(userInfo)
        .then((userAndVerification) => {
          let { user, verification, password, token } = userAndVerification;
          expect(user.email).to.be.equal(userInfo.email.toLowerCase());
          expect(user.verified).to.be.equal(false);
          expect(verification.email).to.be.equal(userInfo.email.toLowerCase());
          expect(verification.verification_code).to.be.a("string");
          expect(password).to.be.undefined;
          expect(token.token).to.be.a("string");
          expect(token.expires).to.be.a("number");
          done();
        })
        .catch(console.error);
    });
    it("it should error????? when there is no email", function (done) {
      users
        .createUserVerificationAndPassword({ password: userInfo.password })
        .then((userAndVerification) => {})
        .catch((err) => {
          // i think an error is OK
          done();
        });
    });
    it("it should error????? when there is no password", function (done) {
      users
        .createUserVerificationAndPassword({ email: userInfo.email })
        .then((userAndVerification) => {})
        .catch((err) => {
          // i think an error is OK
          done();
        });
    });
  });
  describe("#verifyUser", function (done) {
    it("it should verify that the verification code is correct", function (done) {
      users
        .createUserVerificationAndPassword(userInfo)
        .then((userAndVerification) => {
          let { verification } = userAndVerification;
          users
            .verifyUser(verification.verification_code)
            .then((user) => {
              expect(user.verified).to.be.equal(true);
              expect(user.email).to.be.equal(userInfo.email.toLowerCase());
              done();
            })
            .catch(console.error);
        })
        .catch(console.error);
    });
    it("it should return false on inaccurate verification codes ", function (done) {
      users
        .createUserVerificationAndPassword(userInfo)
        .then(async (userAndVerification) => {
          let user = await users.verifyUser("73c89749-43a9-4e6d-83d7-37a8c70ca265");
          expect(user.verified).to.be.equal(false);
          user = await users.verifyUser(null);
          expect(user.verified).to.be.equal(false);
          user = await users.verifyUser("43a9-4e6d-83d7-37a8c70ca265");
          expect(user.verified).to.be.equal(false);
          done();
        })
        .catch(console.error);
    });
  });
  describe("#forgotPassword", function () {
    it("it should generate a new temporary password if the user forgot", function (done) {
      users
        .createUserVerificationAndPassword(userInfo)
        .then((userAndVerification) => {
          users
            .forgotPassword(userInfo.email)
            .then((userInfoTempPassword) => {
              let { email, password, expiresIn } = userInfoTempPassword;
              expect(email).to.be.equal(userInfo.email.toLowerCase());
              expect(password).to.be.a("string");
              expect(expiresIn).to.be.a("number");
              done();
            })
            .catch(console.error);
        })
        .catch(console.error);
    });
    it("it should return null, if no user", function (done) {
      users
        .forgotPassword(null)
        .then((userInfoTempPassword) => {
          expect(userInfoTempPassword).to.be.null;
          done();
        })
        .catch(console.error);
    });
    it("it should return null, if no user", function (done) {
      users
        .forgotPassword("dummyUser")
        .then((userInfoTempPassword) => {
          expect(userInfoTempPassword).to.be.null;
          done();
        })
        .catch(console.error);
    });
  });
  describe("#resetPasswordFromTemporaryPassword", function () {
    it("should reset the password from temp password", function (done) {
      users
        .createUserVerificationAndPassword(userInfo)
        .then((userAndVerification) => {
          users
            .forgotPassword(userInfo.email)
            .then((userInfoTempPassword) => {
              users
                .resetPasswordFromTemporaryPassword(
                  userInfo.email,
                  userInfoTempPassword.password,
                  userInfo.newPassword
                )
                .then((resp) => {
                  expect(resp).to.be.equal(true);
                  done();
                })
                .catch(console.error);
            })
            .catch(console.error);
        })
        .catch(console.error);
    });
    it("should should not reset if the password or email is not valid", function (done) {
      users
        .resetPasswordFromTemporaryPassword(null, "password", userInfo.newPassword)
        .then(async (resp) => {
          expect(resp).to.be.equal(false);
          let temp = await users.resetPasswordFromTemporaryPassword(
            null,
            null,
            userInfo.newPassword
          );
          expect(temp).to.be.equal(false);
          temp = await users.resetPasswordFromTemporaryPassword("null", null, null);
          expect(temp).to.be.equal(false);
          temp = await users.resetPasswordFromTemporaryPassword("null", "null", null);
          expect(temp).to.be.equal(false);
          done();
        })
        .catch(console.error);
    });
    it("should verify that the temp password is valid", function (done) {
      users
        .createUserVerificationAndPassword(userInfo)
        .then((userAndVerification) => {
          users
            .forgotPassword(userInfo.email)
            .then((userInfoTempPassword) => {
              users
                .resetPasswordFromTemporaryPassword(
                  userInfo.email,
                  "dsfjkhaskdjhfjksd",
                  "jfaksjdhfkjwehfj"
                )
                .then((resp) => {
                  expect(resp).to.be.equal(false);
                  done();
                })
                .catch(console.error);
            })
            .catch(console.error);
        })
        .catch(console.error);
    });
  });
  describe("#getUser", function () {
    it("should get the user", function (done) {
      users
        .createUserVerificationAndPassword(userInfo)
        .then(async (userAndVerification) => {
          let { user, verification, password } = userAndVerification;
          let gu = await users.getUser(user.email);
          expect(gu.email).to.be.equal(user.email);
          done();
        })
        .catch(console.error);
    });
    it("should return null when the user does not exist", function (done) {
      users.getUser("garjack").then(async (user) => {
        expect(user).to.be.null;
        user = await users.getUser(null).catch(console.error);
        expect(user).to.be.null;
        user = await users.getUser(null);
        expect(user).to.be.null;
        done();
      });
    });
  });
  describe("#updateUser", function () {
    it("should update the user", function (done) {
      users
        .createUserVerificationAndPassword(userInfo)
        .then(async (userAndVerification) => {
          let { token } = userAndVerification;
          users
            .updateUser(userUpdateInfo, token.token)
            .then((resp) => {
              expect(resp.success).to.be.equal(true);
              expect(resp.user.shirt).to.be.equal(userUpdateInfo.shirt);
              done();
            })
            .catch(console.error);
        })
        .catch(console.error);
    });
    it("should return false if the user does not exist", function (done) {
      users
        .updateUser({ email: "something" }, "faklsdjflkasjd.asdlkfjklasdjfklj.asldfjlkasdjfkl")
        .then(async (resp) => {
          expect(resp.success).to.be.equal(false);
          resp = await users.updateUser(null);
          expect(resp.success).to.be.equal(false);
          done();
        });
    });
  });
});
