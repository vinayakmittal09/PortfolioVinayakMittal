const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { uploadFile } = require("../controllers/uploadController");

router.post("/", requireAuth, upload.single("file"), uploadFile);

module.exports = router;
