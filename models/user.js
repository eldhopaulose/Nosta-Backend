const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  isVerified: { type: Boolean, default: false },
  isLogedIn: { type: Boolean, default: false },
  regOTP: String,
  sigOTP: String,
  regOTPExpiration: Date,
  sigOTPExpiration: Date,
});

//Send OTP

async function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMS_HOST,
    port: Number(process.env.SMS_PORT),
    secure: false,
    auth: {
      user: process.env.SMS_USER,
      pass: process.env.SMS_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMS_USER,
    to: email,
    subject: "Verification OTP for Signup",
    text: `Your OTP for signup is: ${otp}`,
  });
}

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

userSchema.statics.sendOTP = async function (email, name) {
  let user = await this.findOne({ email });
  if (user) throw new Error("User already registered.");

  const regOTP = generateOTP();
  const regOTPExpiration = new Date();
  regOTPExpiration.setMinutes(regOTPExpiration.getMinutes() + 5);

  user = new User({
    name,
    email,
    regOTP,
    regOTPExpiration,
  });
  await user.save();

  await sendOTP(email, regOTP);

  // Schedule a task to delete the user if not verified within 5 minutes
  setTimeout(async () => {
    const userToDelete = await this.findOne({ email, isVerified: false });
    if (userToDelete) {
      await userToDelete.deleteOne();
      console.log(`User ${email} deleted due to non-verification.`);
    }
  }, 1 * 60 * 1000);

  return user;
};

//verify OTP

userSchema.statics.verifyOTP = async function (email, otp) {
  const user = await this.findOne({ email });
  console.log(user);
  if (!user) throw new Error("User not found.");

  if (user.regOTP !== otp || user.regOTPExpiration < new Date()) {
    throw new Error("Invalid OTP or OTP expired.");
  }

  user.isVerified = true;
  return await user.save();
};

//resend OTP

userSchema.statics.resendRegistrationOTP = async function (email) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found.");
  }

  if (user.isVerified) {
    throw new Error("User already verified.");
  }

  const regOTP = generateOTP();
  const regOTPExpiration = new Date();
  regOTPExpiration.setMinutes(regOTPExpiration.getMinutes() + 5);

  user.regOTP = regOTP;
  user.regOTPExpiration = regOTPExpiration;

  await user.save();

  await sendOTP(email, regOTP);

  return "OTP resent successfully.";
};

// Sign in
userSchema.statics.signIn = async function (email) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found.");
  }

  const signInOTP = generateOTP();
  const signInOTPExpiration = new Date();
  signInOTPExpiration.setMinutes(signInOTPExpiration.getMinutes() + 5);

  user.sigOTP = signInOTP;
  user.isLogedIn = false;
  user.sigOTPExpiration = signInOTPExpiration;

  await user.save();

  await sendOTP(email, signInOTP);

  return signInOTP;
};

userSchema.statics.verifySignInOTP = async function (email, otp) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found.");

  console.log(user.sigOTP, otp, user.sigOTPExpiration, new Date());
  if (user.sigOTP !== otp || user.sigOTPExpiration < new Date()) {
    throw new Error("Invalid OTP or OTP expired.");
  }

  user.isLogedIn = true;

  // Schedule a task to delete the user if not verified within 5 minutes
  setTimeout(async () => {
    const userisLogedIn = await this.findOne({ email, isLogedIn: true });
    if (userisLogedIn) {
      user.isLogedIn = false;
      await user.save();
      console.log(`User ${email} Clear Logedin.`);
    }
  }, 1 * 60 * 1000);

  return await user.save();
};

userSchema.statics.resendSignInOTP = async function (email) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found.");
  }

  const signInOTP = generateOTP();
  const signInOTPExpiration = new Date();
  signInOTPExpiration.setMinutes(signInOTPExpiration.getMinutes() + 5);

  user.sigOTP = signInOTP;
  user.sigOTPExpiration = signInOTPExpiration;

  await user.save();

  await sendOTP(email, signInOTP);

  return "Sign-in OTP resent successfully.";
};

const User = mongoose.model("User", userSchema);

module.exports = User;
