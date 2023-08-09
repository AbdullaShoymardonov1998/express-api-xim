const { Sequelize } = require("sequelize");

let sequelize = new Sequelize("task_xim", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});
const force = false;
const alter = true;
sequelize.sync({ force, alter });
module.exports = sequelize;
