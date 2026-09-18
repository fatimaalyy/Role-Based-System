const express = require("express");
const router = express.Router();
const { createShopAdmin, getCompanyTeam } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("companyadmin"));

router.post("/shopadmin", createShopAdmin);
router.get("/team", getCompanyTeam);

module.exports = router;
