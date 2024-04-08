const Product = require("../models/product");

//get by category

exports.getByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const products = await Product.find({ category });

    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get by id

exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
