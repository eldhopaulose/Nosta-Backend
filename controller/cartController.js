const Cart = require("../models/cart");
const Product = require("../models/product");
const User = require("../models/user");

// Add to cart

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;
    let { quantity } = req.body;
    // If quantity is not provided or invalid, default to 1
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      quantity = 1;
    }
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (!user || !product) {
      res
        .status(404)
        .json({ success: false, message: "User or product not found" });
      return;
    }
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      const newCart = await Cart.create({
        userId,
        items: [
          {
            productId: productId,
            quantity,
            totalCost: quantity * product.price,
          },
        ],
      });
      res.status(200).json({ success: true, cart: newCart });
    } else {
      const productIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (productIndex >= 0) {
        cart.items[productIndex].quantity += quantity;
        cart.items[productIndex].totalCost =
          cart.items[productIndex].quantity * product.price;
      } else {
        cart.items.push({
          productId: productId,
          quantity,
          totalCost: quantity * product.price,
        });
      }
      await cart.save();
      res.status(200).json({ success: true, cart });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
exports.decrimentCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;
    let { quantity } = req.body;

    // If quantity is not provided or invalid, default to 1
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      quantity = 1;
    }

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      res
        .status(404)
        .json({ success: false, message: "User or product not found" });
      return;
    }

    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      const newCart = await Cart.create({
        userId,
        items: [{ productId: productId, quantity }],
      });
      res.status(200).json({ success: true, cart: newCart });
    } else {
      const productIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex >= 0) {
        // Ensure quantity doesn't go below 1
        cart.items[productIndex].quantity = Math.max(
          1,
          cart.items[productIndex].quantity - quantity
        );
        cart.items[productIndex].totalCost =
          cart.items[productIndex].quantity * product.price;
      } else {
        cart.items.push({
          productId: productId,
          quantity,
          totalCost: quantity * product.price,
        });
      }

      await cart.save();
      res.status(200).json({ success: true, cart });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("userId")
      .populate("items.productId");
    res.status(200).json({ success: true, carts });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update quantity in cart
exports.updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;
    console.log("productId", productId);
    let { quantity } = req.body;
    // If quantity is not provided or invalid, default to 1
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      quantity = 1;
    }
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (!user || !product) {
      res
        .status(404)
        .json({ success: false, message: "User or product not found" });
      return;
    }
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      res
        .status(404)
        .json({ success: false, message: "Cart not found for the user" });
      return;
    }
    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex >= 0) {
      cart.items[productIndex].quantity = quantity;
      await cart.save();
      res.status(200).json({ success: true, cart });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Product not found in the cart" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOneAndDelete({ userId: userId });
    if (!cart) {
      res
        .status(404)
        .json({ success: false, message: "Cart not found for the user" });
      return;
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteSingleCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;
    const cart = await Cart.findOneAndUpdate(
      { userId: userId },
      { $pull: { items: { productId: productId } } },
      { new: true }
    );
    if (!cart) {
      res
        .status(404)
        .json({ success: false, message: "Cart not found for the user" });
      return;
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
