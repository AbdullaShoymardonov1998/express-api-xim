const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../keys/keys");

exports.signup = async (req, res) => {
  let { email, password } = req.body;
  const user = await User.create({
    email,
    password,
  });

  if (user.password) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  const token = jwt.sign(
    {
      id: user.id,
    },
    SECRET,
    { expiresIn: "365d" }
  );

  const refreshToken = await jwt.sign({ id: user.id }, SECRET, {
    expiresIn: "2d",
  });

  res.status(200).json({
    accessToken: token,
    refreshToken,
    user: user,
  });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.password) {
      user.password = await bcrypt.hash(user.password, 12);
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.status(400).json({ error: "Wrong email or password!" });
    }

    const accessToken = await jwt.sign({ id: user.id }, SECRET, {
      expiresIn: "1d",
    });

    const refreshToken = await jwt.sign({ id: user.id }, SECRET, {
      expiresIn: "2d",
    });

    return res.json({
      token: {
        accessToken,
        refreshToken,
      },
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error(err.message);
    return err;
  }
};

exports.signInToken = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: res.locals.id,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = await jwt.sign({ id: user.id }, SECRET, {
      expiresIn: "1d",
    });

    const refreshToken = await jwt.sign({ id: user.id }, SECRET, {
      expiresIn: "2d",
    });
    return res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {}
};

// exports.getUser = async (req, res, next) => {
//   try {
//     const user = await User.findByPk(req.params.id);

//     if (!user) {
//       throw new Error("User not found");
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     next(error);
//   }
// };

// exports.updateUser = async (req, res, next) => {
//   try {
//     let user = await User.findByPk(req.body.id);

//     if (!user) {
//       throw new Error("User not found");
//     }

//     for (key in req.body) {
//       user[key] = req.body[key];
//     }

//     if (user.password) {
//       user.password = await bcrypt.hash(user.password, 12);
//     }

//     const updatedUser = await user.save();

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     next(error);
//   }
// };

// exports.checktoken = async (req, res, next) => {
//   try {
//     const token = req.get("Authorization");
//     let adminToken;

//     if (!token) {
//       return res.status(400).json({ error: "Not Authenticated" });
//     }

//     adminToken = jwt.verify(token, SECRET);
//     if (!adminToken) {
//       return res.status(400).json({ error: "Not Authenticated" });
//     }

//     res.status(200).json({ valid: true });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };
