const fs = require("fs");
const path = require("path");
const File = require("../models/file.model");
const { PAGE_LIMIT } = require("../keys/keys");
exports.createFileUpload = async (req, res, next) => {
  try {
    const { originalname, mimetype, filename } = req.file;
    const extensions = req.file.originalname.split(".");
    const extension = extensions[extensions.length - 1];
    const createFileInfo = await File.create({
      originalname,
      mimetype,
      filename,
      extension,
    });

    res.status(200).json(createFileInfo);
  } catch (error) {
    next(error);
  }
};

exports.getUploadedFile = async (req, res) => {
  let page = req.query.page;
  const skip = (page - 1) * PAGE_LIMIT;
  const uploadedFileInfo = await File.findAll({
    offset: skip,
    limit: PAGE_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await File.count({
    uploadedFileInfo,
  });
  const pages = Math.ceil(total / PAGE_LIMIT);

  res.json({ uploadedFileInfo, pages, total });
};

exports.getUploadedFileById = async (req, res) => {
  const file = await File.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!file) {
    res.status(404).json({
      message: "File with given Id is ot found",
    });
  }

  res.json(file);
};

exports.deleteFileById = async (req, res) => {
  const fileToDelete = await File.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!fileToDelete) {
    res.status(404).json({
      message: "Id not found",
    });
  } else {
    const filePath = path.join("uploads", fileToDelete.filename);
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({
        message: "Error deleting file from local storage",
      });
      return;
    }

    await File.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({
      message: `File with an id ${req.params.id} is deleted successfully`,
    });
  }
};

exports.updateFileById = async (req, res) => {
  const { id, originalname, mimetype, filename, extension } = req.file;
  const fileToUpdate = await File.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!fileToUpdate) {
    res.status(404).json({
      message: "Id not found",
    });
  } else {
    await fileToUpdate.update({
      originalname,
      mimetype,
      filename,
      extension,
    });
    await fileToUpdate.save();
    const filePath = path.join("uploads", fileToUpdate.filename);
    fs.unlinkSync(filePath);
  }
  res.json({
    message: "Updated",
    fileToUpdate,
  });
};
