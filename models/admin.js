const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  email: { type: String, unique: true },
  isVerified: { type: Boolean, default: false },
  isLogedIn: { type: Boolean, default: false },
  name: { type: String, required: true },
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
    text: `Your Nosta OTP for signup is: ${otp}`,
  });
}

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

adminSchema.statics.sendOTP = async function (email, name) {
  let admin = await this.findOne({ email });
  console.log(name);
  if (admin) throw new Error("Admin already registered.");

  const regOTP = generateOTP();
  const regOTPExpiration = new Date();
  regOTPExpiration.setMinutes(regOTPExpiration.getMinutes() + 5);

  admin = new Admin({
    name,
    email,
    regOTP,
    regOTPExpiration,
  });
  await admin.save();

  await sendOTP(email, regOTP);

  // Schedule a task to delete the admin if not verified within 5 minutes
  setTimeout(async () => {
    const adminToDelete = await this.findOne({ email, isVerified: false });
    if (adminToDelete) {
      await adminToDelete.deleteOne();
      console.log(`Admin ${email} deleted due to non-verification.`);
    }
  }, 1 * 60 * 1000);

  return admin;
};

//verify OTP

adminSchema.statics.verifyOTP = async function (email, otp) {
  const admin = await this.findOne({ email });
  if (!admin) throw new Error("Admin not found.");

  if (admin.regOTP !== otp || admin.regOTPExpiration < new Date()) {
    throw new Error("Invalid OTP or OTP expired.");
  }

  admin.isVerified = true;
  return await admin.save();
};

//resend OTP

adminSchema.statics.resendRegistrationOTP = async function (email) {
  const admin = await this.findOne({ email });
  if (!admin) {
    throw new Error("Admin not found.");
  }

  if (admin.isVerified) {
    throw new Error("Admin already verified.");
  }

  const regOTP = generateOTP();
  const regOTPExpiration = new Date();
  regOTPExpiration.setMinutes(regOTPExpiration.getMinutes() + 5);

  admin.regOTP = regOTP;
  admin.regOTPExpiration = regOTPExpiration;

  await admin.save();

  await sendOTP(email, regOTP);

  return "OTP resend successfully.";
};

// Sign in
adminSchema.statics.signIn = async function (email) {
  const admin = await this.findOne({ email });
  if (!admin) {
    throw new Error("Admin not found.");
  }

  const signInOTP = generateOTP();
  const signInOTPExpiration = new Date();
  signInOTPExpiration.setMinutes(signInOTPExpiration.getMinutes() + 5);

  admin.sigOTP = signInOTP;
  admin.isLogedIn = false;
  admin.sigOTPExpiration = signInOTPExpiration;

  await admin.save();

  await sendOTP(email, signInOTP);

  return signInOTP;
};

adminSchema.statics.verifySignInOTP = async function (email, otp) {
  const admin = await this.findOne({ email });
  if (!admin) throw new Error("admin not found.");

  console.log(admin.sigOTP, otp, admin.sigOTPExpiration, new Date());
  if (admin.sigOTP !== otp || admin.sigOTPExpiration < new Date()) {
    throw new Error("Invalid OTP or OTP expired.");
  }

  admin.isLogedIn = true;

  // Schedule a task to delete the admin if not verified within 5 minutes
  setTimeout(async () => {
    const adminisLogedIn = await this.findOne({ email, isLogedIn: true });
    if (adminisLogedIn) {
      admin.isLogedIn = false;
      await admin.save();
      console.log(`Admin ${email} Clear Logedin.`);
    }
  }, 24 * 60 * 1000);

  return await admin.save();
};

adminSchema.statics.resendSignInOTP = async function (email) {
  const admin = await this.findOne({ email });
  if (!admin) {
    throw new Error("admin not found.");
  }

  const signInOTP = generateOTP();
  const signInOTPExpiration = new Date();
  signInOTPExpiration.setMinutes(signInOTPExpiration.getMinutes() + 5);

  admin.sigOTP = signInOTP;
  admin.sigOTPExpiration = signInOTPExpiration;

  await admin.save();

  await sendOTP(email, signInOTP);

  return "Sign-in OTP resend successfully.";
};

// Export the model
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
