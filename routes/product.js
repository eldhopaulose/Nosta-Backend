const express = require("express");
const product = require("../controller/productController");
const requireAdminAuth = require("../middleware/requireAdminAuth");

const router = express.Router();

router.use(requireAdminAuth);

router.post("/create", product.createProduct);
router.get("/all", product.getAllProducts);

module.exports = router;
