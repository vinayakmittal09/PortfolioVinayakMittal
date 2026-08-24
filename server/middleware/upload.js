const multer = require("multer");
const path = require("path");
const { cloudinary, isConfigured } = require("../config/cloudinary");

const ALLOWED_MIME = [
  "image/jpeg", "image/png", "image/webp", "image/avif", "image/gif",
  "video/mp4", "video/webm", "video/quicktime"
];
const MAX_SIZE = 100 * 1024 * 1024; // 100MB, generous for short video clips

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    return cb(new Error("Unsupported file type. Allowed: jpg, png, webp, avif, gif, mp4, webm, mov."));
  }
  cb(null, true);
}

let storage;

if (isConfigured) {
  const { CloudinaryStorage } = require("multer-storage-cloudinary");
  storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: "kai-asher-portfolio",
      resource_type: file.mimetype.startsWith("video") ? "video" : "image"
    })
  });
} else {
  // Local disk fallback so uploads still work without a Cloudinary account.
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
    filename: (req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    }
  });
}

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });

module.exports = upload;
