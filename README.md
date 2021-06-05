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

|Name|Type|Description|
| :---        |    :----:   |          ---: |
|googleClientId|String|the Google Client ID so that you can authenticate Google Tokens|
|tempPasswordOptions.tempPasswordLifetime|Number||
|keyStore.keyCount|Number|The key count, the number of keys that are used to verify a token, making the key expire in (keyCount \* timeLimit) time|
|keyStore.timeLimit|Number|The time limit each key lasts|

## Plugin

Create a plugin using these methods and objects that comprise the plugin. Each signature of these methods have to be retained. All methods are Async and thus can return Promises. Each require the indicated parameters, and each requires a certian return value.

### TemporaryPasswordRepo

- insertNewUserIdAndPassword {user_id, newRandomPassword} - return {expiresIn, user_id, password}
- selectTemporaryPasswordById {user_id} - return {created, password}
- deleteAllOldTempPasswords {timesUpLimit} - returns null
- deleteTempPassword {user_id} - returns null

### TokenRepo

- returnAllKeysFromRepo {()} - returns [{key, created},...]
- deleteTheOldestKey {()} - returns null
- insertNewKey {(key, created)} - returns {key, token}

### UserRepo

- getUserIsVerified {(user_id)} - returns {string, string}{user_id, verified}
- verifyUser {(user_id)} - returns {verified, user_id}
- createUser {(user)} - returns {Object} user
- getUser {(user)} - returns {Object} user
- updateUser {(user), token} - reutrns {Object} updatedUserInfo

### UserVerificationRepo

- getVerificationCode {(verification_code)} -- {verification_code, created}
- createVerificationCode {(user_id, verification_code)} -- returns {user_id, verification_code}
- deleteVerificationCode {(verification_code)} -- returns nothing

### PasswordRepo

- insertPassword {({user_id, password, key})} -- returns encryptedPassword
- deletePasswordById {(user_id)} -- nothing returned
- updatePasswordOnlyShouldBeUsedOnce {(user_id, password, key)} -- does not return anything
- getPasswordForId {(user_id)} -- return {encryptedpassword, key}
