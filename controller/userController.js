const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Secret key for JWT
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.USER_JWT_SCERET, { expiresIn: "1d" });
};

// Register a new user
exports.register = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.sendOTP(email);

    res.status(200).json({ email, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Verify the OTP
exports.verify = async (req, res) => {
  const { email, otp } = req.body;

  try {
    await User.verifyOTP(email, otp);
    const token = createToken(user._id);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Resend the OTP
exports.resendRegOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.resendRegistrationOTP(email);
    res.status(200).json({ message: "OTP resent successfully.", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Sign in

exports.signIn = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.signIn(email);

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Verify the sign in OTP

exports.verifySignIn = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.verifySignInOTP(email, otp);
    const token = createToken(user._id);
    res.status(200).json({ message: "Sign-in successful", token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Resend the sign in OTP

exports.resendSigninOTP = async (req, res) => {
  const { email } = req.body;

  try {
    await User.resendSignInOTP(email);
    res.status(200).json({ message: "OTP resent successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  const userId = req.user._id; // Assuming req.user._id contains the correct user ID
  try {
    const user = await User.findOne({ _id: userId })
      .select("-regOTP")
      .select("-regOTPExpiration")
      .select("-sigOTP");
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
