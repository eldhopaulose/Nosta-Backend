const express = require("express");
const router = express.Router();

const cartController = require("../controller/cartController");
const requireUserAuth = require("../middleware/requireUserAuth");

router.use(requireUserAuth);
// Add a product to the cart
router.post("/add/:id", cartController.addToCart);

// Get all carts
router.get("/", cartController.getAllCarts);

// Update the quantity of a product in the cart
router.put("/update/:id", cartController.updateCartQuantity);

module.exports = router;
