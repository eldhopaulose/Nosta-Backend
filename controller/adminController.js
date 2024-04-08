const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.ADMIN_JWT_SCERET, { expiresIn: "1d" });
};

// Create a new admin
exports.register = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.sendOTP(email);
    res.status(200).json({ email, admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Verify the OTP
exports.verify = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await Admin.verifyOTP(email, otp);
    const token = createToken(admin._id);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Resend the OTP
exports.resendRegOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.resendRegistrationOTP(email);
    res.status(200).json({ message: "OTP resent successfully.", admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Sign in
exports.signIn = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.signIn(email);

    res.status(200).json({ admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Verify the sign in OTP
exports.verifySignIn = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await Admin.verifySignInOTP(email, otp);
    const token = createToken(admin._id);
    res.status(200).json({ message: "Sign-in successful", token, admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Resend the sign in OTP
exports.resendSigninOTP = async (req, res) => {
  const { email } = req.body;

  try {
    await Admin.resendSignInOTP(email);
    res.status(200).json({ message: "OTP resent successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
