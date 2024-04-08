const Product = require("../models/product");

// Create a new product

exports.createProduct = async (req, res) => {
  const {
    name,
    price,
    discount,
    thumbnail,
    images,
    description,
    category,
    shippingCost,
  } = req.body;

  try {
    const product = await Product.create({
      name,
      price,
      discount,
      thumbnail,
      images,
      description,
      category: [category, "All"],
      shippingCost,
    });

    res.status(200).json({ status: "ok", product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ status: "ok", products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
