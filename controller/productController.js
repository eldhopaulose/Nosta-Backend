const Product = require("../models/product");

// Create a new product

exports.createProduct = async (req, res) => {
  const {
    name,
    price,
    originalPrice,
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
      originalPrice,
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

exports.findProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a product

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    price,
    originalPrice,
    discount,
    thumbnail,
    images,
    description,
    category,
    shippingCost,
  } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        originalPrice,
        discount,
        thumbnail,
        images,
        description,
        category: [category, "All"],
        shippingCost,
      },
      {
        new: true,
      }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ status: "ok", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res
      .status(200)
      .json({ status: "ok", message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
