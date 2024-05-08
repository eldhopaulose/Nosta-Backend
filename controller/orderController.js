const Order = require("../models/order");
const Cart = require("../models/cart");

exports.orderPlaced = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId, totalCost, address } = req.body;

    if (!productId || !totalCost || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userCart = await Cart.findOne({ userId }).populate("items.productId");

    if (!userCart) {
      throw new Error("User's cart not found");
    }

    // Map cart items to order items
    const orderItems = userCart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      totalCost: item.totalCost,
    }));

    const newOrder = new Order({
      items: orderItems,
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
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
