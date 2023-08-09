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
router.get("/list", fileController.getUploadedFile);

router.get("/:id", fileController.getUploadedFileById);

router.put("/:id", fileHandler.single("file"), fileController.updateFileById);

router.delete("/:id", fileController.deleteFileById);

router.get(
  "/download/:id",
  fileHandler.single("file"),
  fileController.downloadFileById
);

module.exports = router;
