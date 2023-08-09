const express = require("express");
const fileController = require("../controllers/file");
const fileHandler = require("../utils/fileHandler");
const auth = require("../utils/auth");

const router = express.Router();
router.post(
  "/create",
  auth.isAuth,
  fileHandler.single("file"),
  fileController.createFileUpload
);
router.get("/list", auth.isAuth, fileController.getUploadedFile);

router.get("/:id", auth.isAuth, fileController.getUploadedFileById);

router.put(
  "/:id",
  auth.isAuth,
  fileHandler.single("file"),
  fileController.updateFileById
);

router.delete("/:id", auth.isAuth, fileController.deleteFileById);

router.get(
  "/download/:id",
  fileHandler.single("file"),
  auth.isAuth,
  fileController.downloadFileById
);

module.exports = router;
