const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Token = sequelize.define("Token", {
  accessToken: {
    type: DataTypes.STRING,
  },
  refreshToken: {
    type: DataTypes.STRING,
  },
});

module.exports = Token;
