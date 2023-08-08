const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const File = sequelize.define("File", {
  // filename: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  // filepath: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },

  originalname: {
    type: DataTypes.STRING,
  },
  mimetype: {
    type: DataTypes.STRING,
  },
  filename: {
    type: DataTypes.STRING,
  },
  extension: {
    type: DataTypes.STRING,
  },
});

module.exports = File;
