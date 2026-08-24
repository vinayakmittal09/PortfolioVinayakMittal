const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const ctrl = require("../controllers/categoryController");

router.get("/", ctrl.getAll);
router.post("/", requireAuth, ctrl.create);

module.exports = router;
