const express = require("express");
const userController = require("../controllers/user");
const auth = require("../utils/auth");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);

router.post("/signin/new_token", auth.isAuth, userController.signInToken);
// router.get("/:id", userController.getUser);
// router.put("/update", auth.isAuth, userController.updateUser);
// router.post("/checktoken", auth.isAuth, userController.checktoken);

module.exports = router;
