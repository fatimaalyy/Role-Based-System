const express = require("express");
const router = express.Router();
const { createCompany, getAllCompanies, deleteCompany } = require("../controllers/companyController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("superadmin"));

router.post("/", createCompany);
router.get("/", getAllCompanies);
router.delete("/:id", deleteCompany);

module.exports = router;
