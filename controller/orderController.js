const Order = require("../models/order");
const Cart = require("../models/cart");

exports.orderPlaced = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    const { totalCost, address } = req.body;

    // Assuming address is the correct variable to check
    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new Error("No cart found for this user.");
    }

    // Map cart items to order items
    // Assuming you have a function to map and calculate totalCost for each item
    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      // Calculate the total cost for each item
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
    cart.items = [];
    await cart.save();

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
