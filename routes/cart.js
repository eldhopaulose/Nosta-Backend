const express = require("express");
const router = express.Router();

const cartController = require("../controller/cartController");
const requireUserAuth = require("../middleware/requireUserAuth");

router.use(requireUserAuth);
// Add a product to the cart
router.post("/add/:id", cartController.addToCart);
router.post("/decriment/:id", cartController.decrimentCart);

// Get all carts
router.get("/", cartController.getAllCarts);

// Update the quantity of a product in the cart
router.put("/update/:id", cartController.updateCartQuantity);

// Remove a product from the cart
router.delete("/remove/:id", cartController.deleteSingleCart);

// Remove all products from the cart
router.delete("/remove-all", cartController.deleteCart);

module.exports = router;
