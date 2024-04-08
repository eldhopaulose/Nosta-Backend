const express = require("express");
const router = express.Router();

const adminController = require("../controller/adminController");

router.post("/register", adminController.register);
router.post("/register/verify", adminController.verify);
router.post("/register/resend", adminController.resendRegOTP);
router.post("/signin", adminController.signIn);
router.post("/signin/verify", adminController.verifySignIn);
router.post("/signin/resend", adminController.resendSigninOTP);

module.exports = router;
