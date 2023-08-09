const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const File = sequelize.define("File", {
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
  size: {
    type: DataTypes.INTEGER,
  },
});

module.exports = File;
