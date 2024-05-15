const Offer = require("../models/offer");

exports.createOffer = async (req, res) => {
  const { image } = req.body;

  try {
    const offer = await Offer.create({
      image,
    });
    res.status(201).json({ offer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.status(200).json({ offers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteOffer = async (req, res) => {
  const { id } = req.params;
  try {
    const offer = await Offer.findByIdAndDelete(id);
    res.status(200).json({ offer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
