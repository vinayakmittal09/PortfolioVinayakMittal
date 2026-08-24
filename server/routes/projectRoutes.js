const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const ctrl = require("../controllers/projectController");

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.post("/", requireAuth, ctrl.create);
router.put("/:id", requireAuth, ctrl.update);
router.delete("/:id", requireAuth, ctrl.remove);

module.exports = router;
