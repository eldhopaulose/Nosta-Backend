const Order = require("../models/order");
const Cart = require("../models/cart");

exports.orderPlaced = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    const { totalCost, address } = req.body;

    if (!addressId) {
      return res.status(400).json({ message: "Address ID is required" });
    }

    // Find the user's cart
    const userCart = await Cart.findOne({ userId }).populate("items.productId");

    if (!userCart) {
      return res.status(404).json({ message: "User's cart not found" });
    }

    // Map cart items to order items
    const orderItems = userCart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      totalCost: item.totalCost,
    }));

    // Create the order
    const newOrder = new Order({
      userId,
      items: orderItems,
      address: address,
      totalCost,
    });

    // Save the order
    const savedOrder = await newOrder.save();

    // Clear the user's cart after placing the order
    userCart.items = [];
    await userCart.save();

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
