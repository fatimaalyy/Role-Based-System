const express = require("express");
const router = express.Router();
const { createShop, getShops, updateShop, deleteShop } = require("../controllers/shopController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router.post("/", authorize("companyadmin"), createShop);
router.get("/", authorize("companyadmin", "shopadmin"), getShops);
router.put("/:id", authorize("companyadmin"), updateShop);
router.delete("/:id", authorize("companyadmin"), deleteShop);

module.exports = router;
