const express = require('express');
const { handeSignUp, handleLogin, sendOtp, handleVerifyOtp, sendResetPasswordOtp, veifyResetPasswordOtp, getUserData } = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/signup", handeSignUp);
router.post("/login", handleLogin);
router.post("/sendotp", authenticateUser, sendOtp);
router.post("/verifyotp", authenticateUser, handleVerifyOtp);
router.post("/reset-password-otp", sendResetPasswordOtp);
router.post("/verify-reset-password-otp", veifyResetPasswordOtp);
router.get("/user-data", authenticateUser, getUserData);


module.exports = router;