const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    unique: true,
  },
  items: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      productId: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Cart",
          required: true,
        },
      ],

      totalCost: {
        type: Number,
        required: true,
      },
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
    },
  ],
});

// Plugin to auto-increment orderId
orderSchema.plugin(AutoIncrement, { inc_field: "orderId" });

// Create the Order model
const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
