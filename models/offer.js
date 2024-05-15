const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  image: [
    {
      type: String,
      required: true,
    },
  ],
});

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;
