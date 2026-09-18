const Company = require("../models/Company");
const User = require("../models/User");

// @route POST /api/companies  (superadmin only)
// Creates a Company AND its Company Admin user in one step
const createCompany = async (req, res) => {
  try {
    const { companyName, industry, adminName, adminEmail, adminPassword } = req.body;

    const company = await Company.create({
      name: companyName,
      industry,
      createdBy: req.user._id,
    });

    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "companyadmin",
      companyId: company._id,
    });

    company.ownerAdminId = admin._id;
    await company.save();

    res.status(201).json({ company, admin: { id: admin._id, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/companies  (superadmin only) — sees ALL companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate("ownerAdminId", "name email");
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/companies/:id  (superadmin only)
const deleteCompany = async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createCompany, getAllCompanies, deleteCompany };
