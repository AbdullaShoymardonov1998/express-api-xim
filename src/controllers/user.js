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
    { expiresIn: "10m" }
  );

  const refreshToken = await jwt.sign({ id: user.id }, SECRET, {
    expiresIn: "20m",
  });

  await user.update({
    email,
    password,
    accessToken: token,
    refreshToken,
  });

  res.status(200).json({
    user: user,
  });
};

exports.getUserId = async (req, res) => {
  res.status(200).json({
    userId: res.locals.id,
  });
};

exports.logout = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: res.locals.id,
    },
  });

  const updatedAccessToken = (user.accessToken = "");
  const updatedRefreshToken = (user.refreshToken = "");
  await user.update({
    accessToken: updatedAccessToken,
    refreshToken: updatedRefreshToken,
  });

  res.status(200).json({
    message: "successfully logout",
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
      expiresIn: "10m",
    });

    const refreshToken = await jwt.sign({ id: user.id }, SECRET, {
      expiresIn: "20m",
    });

    await user.update({
      email,
      password,
      accessToken,
      refreshToken,
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
      expiresIn: "10m",
    });

    const refreshToken = await jwt.sign({ id: user.id }, SECRET, {
      expiresIn: "10m",
    });
    return res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {}
};
