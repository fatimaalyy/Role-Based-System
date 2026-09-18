const Product = require("../models/Product");
const Shop = require("../models/Shop");

// @route POST /api/products  (companyadmin or shopadmin)
const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category, shopId } = req.body;

    // Make sure the target shop actually belongs to this admin's company
    const shop = await Shop.findOne({ _id: shopId, companyId: req.user.companyId });
    if (!shop) return res.status(403).json({ message: "Shop does not belong to your company" });

    // shopadmin can only add products to their own shop
    if (req.user.role === "shopadmin" && String(req.user.shopId) !== String(shopId)) {
      return res.status(403).json({ message: "You can only manage your own shop's products" });
    }

    const product = await Product.create({
      name,
      price,
      stock,
      category,
      shopId,
      companyId: req.user.companyId,
      createdBy: req.user._id,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/products
// companyadmin -> all products in their company (optionally filter by ?shopId=)
// shopadmin -> only their own shop's products
const getProducts = async (req, res) => {
  try {
    let filter = { companyId: req.user.companyId };

    if (req.user.role === "shopadmin") {
      filter.shopId = req.user.shopId;
    } else if (req.query.shopId) {
      filter.shopId = req.query.shopId;
    }

    const products = await Product.find(filter).populate("shopId", "name");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, companyId: req.user.companyId });
    if (!product) return res.status(404).json({ message: "Product not found in your company" });

    if (req.user.role === "shopadmin" && String(product.shopId) !== String(req.user.shopId)) {
      return res.status(403).json({ message: "Not your shop's product" });
    }

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, companyId: req.user.companyId });
    if (!product) return res.status(404).json({ message: "Product not found in your company" });

    if (req.user.role === "shopadmin" && String(product.shopId) !== String(req.user.shopId)) {
      return res.status(403).json({ message: "Not your shop's product" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createProduct, getProducts, updateProduct, deleteProduct };
