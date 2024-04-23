const Address = require("../models/address");
exports.addressCreate = async (req, res) => {
  const { name, address, pincode, mobileNumber, district, state } = req.body;
  const userId = req.user._id;
  try {
    const newAddress = await Address.create({
      userId,
      name,
      address,
      pincode,
      mobileNumber,
      district,
      state,
    });
    res.status(201).json({ success: true, newAddress });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.addressGet = async (req, res) => {
  const userId = req.user._id;
  try {
    const address = await Address.find({ userId });
    res.status(200).json({ success: true, address });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.addressDelete = async (req, res) => {
  const addressId = req.params.id;
  try {
    const address = await Address.findOneAndDelete({ _id: addressId });
    res.status(200).json({ success: true, address });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.addressUpdate = async (req, res) => {
  const addressId = req.params.id;
  const { name, address, pincode, mobileNumber, district, state } = req.body;
  try {
    const updateAddress = await Address.findOneAndUpdate(
      { _id: addressId },
      {
        name,
        address,
        pincode,
        mobileNumber,
        district,
        state,
      }
    );
    res.status(200).json({ success: true, updateAddress });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
