const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const offerSchema = new Schema({
  image: [],
});

const Offer = mongoose.model("Offer", offerSchema);
