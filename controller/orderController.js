const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");

exports.orderPlaced = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("User ID:", userId);
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      throw new Error("No cart or cart items found for this user.");
    }
    const order = new Order({
      userId,
      items: cart.items,
      address,
      orderDate: new Date(),
      status: "Placed",
    });

    await order.save();
    // Clear the cart after placing the order
    await Cart.findByIdAndRemove(cart._id);

    res.status(200).json({ order });
    // ... rest of your code to create and save the order
  } catch (error) {
    console.error("Order Placement Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "items",
        populate: {
          path: "productId",
          model: "Cart",
          populate: {
            path: "items.productId",
            model: "Product",
          },
        },
      })
      .populate("items.userId items.address");

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
