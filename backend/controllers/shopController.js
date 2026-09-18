const Shop = require("../models/Shop");

// @route POST /api/shops  (companyadmin only)
const createShop = async (req, res) => {
  try {
    const { name, location } = req.body;
    const shop = await Shop.create({
      name,
      location,
      companyId: req.user.companyId, // forced from token, never from body
      createdBy: req.user._id,
    });
    res.status(201).json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/shops
// companyadmin -> only their own company's shops
// shopadmin -> only their own shop
const getShops = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "companyadmin") {
      filter.companyId = req.user.companyId;
    } else if (req.user.role === "shopadmin") {
      filter._id = req.user.shopId;
    }
    const shops = await Shop.find(filter);
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/shops/:id  (companyadmin only, must own the shop)
const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, companyId: req.user.companyId });
    if (!shop) return res.status(404).json({ message: "Shop not found in your company" });

    Object.assign(shop, req.body);
    await shop.save();
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/shops/:id  (companyadmin only, must own the shop)
const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
    if (!shop) return res.status(404).json({ message: "Shop not found in your company" });
    res.json({ message: "Shop deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createShop, getShops, updateShop, deleteShop };
