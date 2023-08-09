const User = require("../models/user");
const authFunctions = require("../utils/authFunctions");
const jwt = require("jsonwebtoken");
// const { SECRET } = require("../keys/keys");
module.exports.isAuth = async (req, res, next) => {
  const token = req.header("Authorization");
  const jwt = token.split(" ")[1];
  if (!jwt) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  let decoded = await authFunctions.decode(jwt);
  if (!decoded) {
    res.status(401).json({ message: "Token is expired" });
    return;
  }
  const user = await User.findOne({
    where: {
      id: decoded.id,
    },
  });
  if (user.accessToken !== jwt) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  res.locals.id = decoded.id;

  next();
};
