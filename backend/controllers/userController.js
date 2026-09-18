const User = require("../models/User");
const Shop = require("../models/Shop");

// @route POST /api/users/shopadmin  (companyadmin only)
const createShopAdmin = async (req, res) => {
  try {
    const { name, email, password, shopId } = req.body;

    const shop = await Shop.findOne({ _id: shopId, companyId: req.user.companyId });
    if (!shop) return res.status(403).json({ message: "Shop does not belong to your company" });

    const shopAdmin = await User.create({
      name,
      email,
      password,
      role: "shopadmin",
      companyId: req.user.companyId,
      shopId,
    });

    res.status(201).json({ id: shopAdmin._id, email: shopAdmin.email, shopId: shopAdmin.shopId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/users/team  (companyadmin only) — everyone in their company
const getCompanyTeam = async (req, res) => {
  try {
    const users = await User.find({ companyId: req.user.companyId }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createShopAdmin, getCompanyTeam };
