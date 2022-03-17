const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const saucesCtrl = require("../controllers/sauce");

router.get("/", auth, saucesCtrl.getAllSauces);
router.post("/", auth, multer, saucesCtrl.createSauces);
router.post("/:id/like", auth, saucesCtrl.likeSauces);
router.get("/:id", auth, saucesCtrl.getOneSauces);
router.put("/:id", auth, multer, saucesCtrl.modifySauces);
router.delete("/:id", auth, multer, saucesCtrl.deleteSauces);

module.exports = router;
