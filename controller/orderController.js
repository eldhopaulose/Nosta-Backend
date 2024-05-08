const Order = require("../models/order");

exports.orderPlaced = async (req, res) => {
  try {
    const userId = req.user._id;

    // If the request contains productId and totalCost, it implies an order is being placed directly
    const { productId, totalCost, address } = req.body;

    if (productId && totalCost && address) {
      const newOrder = new Order({
        userId,
        items: [{ productId, totalCost }],
        address,
      });
      const savedOrder = await newOrder.save();
      return res.status(201).json(savedOrder);
    }
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
