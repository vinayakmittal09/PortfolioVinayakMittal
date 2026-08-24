const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const ctrl = require("../controllers/contactController");

router.post("/", ctrl.create);
router.get("/", requireAuth, ctrl.getAll);
router.put("/:id", requireAuth, ctrl.update);
router.delete("/:id", requireAuth, ctrl.remove);

module.exports = router;
