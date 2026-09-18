const express = require("express");
const router = express.Router();
const { createProduct, getProducts, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("companyadmin", "shopadmin"));

router.post("/", createProduct);
router.get("/", getProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
