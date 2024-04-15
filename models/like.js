const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const likeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
