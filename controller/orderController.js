const Order = require("../models/order");
const Cart = require("../models/cart");

exports.orderPlaced = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("User ID:", userId);
    const { address } = req.body; // Removed totalCost from destructuring as it will be calculated

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new Error("No cart found for this user.");
    }

    // Map cart items to order items and calculate total cost for each item
    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        const totalCost = product.price * item.quantity;
        return {
          productId: item.productId,
          quantity: item.quantity,
          totalCost, // This is the total cost for each item
        };
      })
    );

    // Calculate the total cost for the entire order
    const orderTotalCost = orderItems.reduce(
      (acc, item) => acc + item.totalCost,
      0
    );

    // Create the order
    const newOrder = new Order({
      userId,
      items: orderItems,
      address,
      totalCost: orderTotalCost, // This is the total cost for the entire order
    });

    // Save the order
    const savedOrder = await newOrder.save();

    // Clear the user's cart after placing the order
    cart.items = [];
    await cart.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Order Placement Error:", error); // Log the error for debugging
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
