const Order = require("../models/order");

exports.orderPlaced = async (req, res) => {
  try {
    // Check if required fields are present
    if (!req.body.items || req.body.items.length === 0) {
      return res
        .status(400)
        .json({ error: "Please provide items in the order." });
    }
    if (
      !req.body.items.every(
        (item) =>
          item.productId &&
          item.quantity &&
          item.totalCost &&
          item.address &&
          item.status
      )
    ) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields for each item." });
    }

    const userId = req.user._id;
    const order = new Order({
      ...req.body,
      items: req.body.items.map((item) => ({ ...item, userId })),
    });
    await order.save();
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate({
      path: "items.userId items.productId items.address",
      options: { strictPopulate: false },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
