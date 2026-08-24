const { isConfigured } = require("../config/cloudinary");

exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const url = isConfigured ? req.file.path : `/uploads/${req.file.filename}`;
    const type = req.file.mimetype.startsWith("video") ? "video" : "image";

    res.status(201).json({
      success: true,
      data: { url, type, provider: isConfigured ? "cloudinary" : "local" }
    });
  } catch (err) {
    next(err);
  }
};
