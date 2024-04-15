const Like = require("../models/like");
const User = require("../models/user");

exports.addLike = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.id;

  try {
    const like = await Like.create({
      userId,
      productId,
    });

    res.status(201).json({ success: true, like });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.removeLike = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.id;

  try {
    const like = await Like.findOneAndDelete({
      userId,
      productId,
    });

    res.status(200).json({ success: true, like });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getLikes = async (req, res) => {
  const userId = req.user._id;

  try {
    const likes = await Like.find({ userId }).populate("productId");

    res.status(200).json({ success: true, likes });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
