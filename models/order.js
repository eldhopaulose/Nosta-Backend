const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      totalCost: {
        type: Number,
        required: true,
      },
    },
  ],
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  status: {
    type: String,
    default: "Paid",
  },
  billDate: {
    type: Date,
    default: () => {
      const now = new Date();
      return now;
    },
  },
  deliveryDate: {
    type: Date,
    default: () => {
      const now = new Date();
      now.setDate(now.getDate() + 7);
      return now;
    },
  },
});
// Plugin to auto-increment orderId
orderSchema.plugin(AutoIncrement, { inc_field: "orderId" });

// Create the Order model
const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
