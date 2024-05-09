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

    // Use Promise.all to wait for all the promises to resolve
    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const product = await Product.findById(item.productId);
          if (!product) {
            throw new Error(`Product not found for ID: ${item.productId}`);
          }
          const totalCost = product.price * item.quantity;
          return {
            productId: item.productId,
            quantity: item.quantity,
            totalCost,
          };
        } catch (error) {
          throw error; // This will be caught by the outer try-catch block
        }
      })
    );

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
