const { Sequelize } = require("sequelize");

let sequelize = new Sequelize("task_xim", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});
const force = false;
const alter = true;
sequelize.sync({ force, alter });
// if (process.env.HOST && process.env.HOST === "webspace") {
//   sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.USER_NAME,
//     process.env.PASSWORD,
//     {
//       host: "localhost",
//       dialect: "mysql",
//       protocol: "mysql",
//     }
//   );
// }

module.exports = sequelize;
