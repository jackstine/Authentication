# Authentication

# Install with

```
npm install @nodeauth/authentication
```

## Setup

Need to create a plugin, a good resource to look at is (auth-pg)[https://github.com/jackstine/auth-pg] .

```javascript
const { auth, createAuthentication } = require("@nodeauth/authentication");
let config = {
  plugin: {
    TemporaryPasswordRepo: TemporaryPasswordRepo(options),
    TokenRepo: TokenRepo(options),
    UserRepo: UserRepo(options),
    UserVerificationRepo: UserVerificationRepo(options),
    PasswordRepo: PasswordRepo(options),
  },
};
await createAuthentication(config);
```

## Options

| Name                                     |  Type  |                                                                                                              Description |
| :--------------------------------------- | :----: | -----------------------------------------------------------------------------------------------------------------------: |
| googleClientId                           | String |                                                          the Google Client ID so that you can authenticate Google Tokens |
| tempPasswordOptions.tempPasswordLifetime | Number |                                                                                                                          |
| keyStore.keyCount                        | Number | The key count, the number of keys that are used to verify a token, making the key expire in (keyCount \* timeLimit) time |
| keyStore.timeLimit                       | Number |                                                                                            The time limit each key lasts |
| tokenize | Function | the returned data is added to the token |

## Plugin

Create a plugin using these methods and objects that comprise the plugin. Each signature of these methods have to be retained. All methods are Async and thus can return Promises. Each require the indicated parameters, and each requires a certian return value.

### TemporaryPasswordRepo

- insertNewUserIdAndPassword {email, newRandomPassword} - return {expiresIn, email, password}
- selectTemporaryPasswordById {email} - return {created, password}
- deleteAllOldTempPasswords {timesUpLimit} - returns null
- deleteTempPassword {email} - returns null

### TokenRepo

- returnAllKeysFromRepo {()} - returns [{key, created},...]
- deleteTheOldestKey {()} - returns null
- insertNewKey {(key, created)} - returns {key, token}

### UserRepo

- getUserIsVerified {(email)} - returns {string, string}{email, verified}
- verifyUser {(email)} - returns {verified, email}
- createUser {(user)} - returns {Object} user
- getUser {(user)} - returns {Object} user
- updateUser {(user), token} - reutrns {Object} updatedUserInfo

### UserVerificationRepo

- getVerificationCode {(verification_code)} -- {verification_code, created}
- createVerificationCode {(email, verification_code)} -- returns {email, verification_code}
- deleteVerificationCode {(verification_code)} -- returns nothing

### PasswordRepo

- insertPassword {({email, password, key})} -- returns encryptedPassword
- deletePasswordById {(email)} -- nothing returned
- updatePasswordOnlyShouldBeUsedOnce {(email, password, key)} -- does not return anything
- getPasswordForId {(email)} -- return {encryptedpassword, key}
