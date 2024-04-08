var express = require("express");
var router = express.Router();
const userController = require("../controller/userController");
const requireUserAuth = require("../middleware/requireUserAuth");

//create a new user
router.post("/register", userController.register);
//verify the OTP
router.post("/register/verify", userController.verify);
//resend the OTP
router.post("/register/resend", userController.resendRegOTP);
//sign in
router.post("/signin", userController.signIn);
//verify the sign in OTP
router.post("/signin/verify", userController.verifySignIn);
//resend the sign in OTP
router.post("/signin/resend", userController.resendSigninOTP);

router.use(requireUserAuth);

//get user details
router.get("/details", userController.getUserDetails);

module.exports = router;
