const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const verifyEditUser = require("./verifyEditUser");
const verifyPetitionFile = require('./verifyPetitionFile')
module.exports = {
  authJwt,
  verifySignUp,
  verifyEditUser,
  verifyPetitionFile
};