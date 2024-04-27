const express = require("express");
const product = require("../controller/productController");
const requireAdminAuth = require("../middleware/requireAdminAuth");
const router = express.Router();

router.post("/create", requireAdminAuth, product.createProduct);

router.get("/all", product.getAllProducts);

router.get("/findproduct/:id", product.findProduct);

router.patch("/updateProduct/:id", requireAdminAuth, product.updateProduct);

router.delete("/deleteProduct/:id", requireAdminAuth, product.deleteProduct);

module.exports = router;
