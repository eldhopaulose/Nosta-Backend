const Order = require("../models/order");

exports.orderPlaced = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId, totalCost, address } = req.body;

    if (!productId || !totalCost || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newOrder = new Order({
      items: [{ productId, totalCost, address, userId }],
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
        path: "items.productId",
        model: "Cart",
      })
      .populate("items.userId items.address items.productId");

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
