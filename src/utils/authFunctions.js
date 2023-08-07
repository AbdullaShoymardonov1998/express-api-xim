const { SECRET } = require("../keys/keys");
const jwt = require("jsonwebtoken");

let authFunctions = {
  hash: async (info) => {
    try {
      let token = await jwt.sign(info, SECRET);
      return token;
    } catch (error) {
      console.error(`Error on hashing token: ${error.message}`);
      throw new Error(error.message);
    }
  },
  decode: async (token) => {
    try {
      let decoded = await jwt.verify(token, SECRET);

      return decoded;
    } catch (error) {
      return null;
    }
  },
};

module.exports = authFunctions;
