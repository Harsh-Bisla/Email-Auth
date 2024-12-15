const UserModel = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require("../utils/nodemailer");
const JWT_SECRET = process.env.JWT_SECRET;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const { EMAIL_VERIFY_TEMPLATE } = require('../utils/emailTemplate');
const { PASSWORD_RESET_TEMPLATE } = require('../utils/emailTemplate');

// Regiter User
const handeSignUp = async (req, res) => {
    const { name, email, password } = req.body;
    if (name && email && password) {
        try {
            const user = await UserModel.findOne({ email });
            if (user) return res.send({ message: "User already exists!", success: false });
            bcrypt.hash(password, 12, async (err, hash) => {
                const createdUser = await UserModel.create({
                    name,
                    email,
                    password: hash
                });
                // sending creating account mail
                const mailOptions = {
                    from: SENDER_EMAIL,
                    to: email,
                    subject: "Verification email",
                    text: `Hello ${name} Welcome to Harsh Bisla mail. Your account is successfully created with this email ${email}`
                }
                await transporter.sendMail(mailOptions);
                return res.send({ message: "User created succcessfully", success: true, createdUser })
            })
        } catch (error) {
            return res.send({ message: error.message, success: false })
        }
    }
    else {
        return res.send({ message: "All fields are required.", success: false })
    }

}

// Login user
const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) return res.send({ message: "Email does not exists! please register" });
            bcrypt.compare(password, user.password, (err, result) => {
                if (!result) return res.send({ message: "Incorrect Password", success: false });
                const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET);
                return res.send({ message: "Loggedin Successfully", success: true, token });
            })
        } catch (error) {
            return res.send({ message: "Internsl Server error", success: false, error: error.messsage });
        }
    }
    else {
        return res.send({ message: "All fields are required", success: false });
    }
}

// send otp for veification
const sendOtp = async (req, res) => {
    const userId = req.user.id;
    if (!userId) return res.send({ message: "userId is empty", success: false });
    try {
        const user = await UserModel.findById(userId);
        if (!user) return res.send({ message: "user not found", success: false });
        if (user.IsAccountVerified) {
            return res.send({ message: "Account already verified", success: false });
        }
        else {
            const otp = Math.floor(Math.random() * 1000000).toString();
            user.verifyOtp = otp;
            user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
            await user.save();
            // sending creating account mail
            const mailOptions = {
                from: SENDER_EMAIL,
                to: user.email,
                subject: "Account verification OTP",
                // text: `Your Account verification OTP is ${otp}`
                html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
            }
            await transporter.sendMail(mailOptions);
            return res.send({ message: "Verification OTP Sent on your Email", success: true })
        }
    } catch (error) {
        return res.send({ message: "Internal server error", success: false, error: error.message })
    }
}

// verify otp
const handleVerifyOtp = async (req, res) => {
    const userId = req.user.id;
    const { otp } = req.body;
    if (otp) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) return res.send({ message: "user not found", success: false });
            if (user.IsAccountVerified) return res.send({ messsage: "Email already verified", success: true });
            if (Date.now() > user.verifyOtpExpiresAt) {
                user.verifyOtp = "";
                user.verifyOtpExpiresAt = 0;
                await user.save();
                return res.send({ message: "OTP has expired", success: false });
            }
            if (otp === user.verifyOtp) {
                user.verifyOtp = "";
                user.verifyOtpExpiresAt = 0;
                user.IsAccountVerified = true;
                await user.save();
                return res.send({ message: "Email verified successfully", success: true });
            }
            else {
                return res.send({ message: "Invalid OTP", success: false })
            }
        } catch (error) {
            return res.send({ message: "Internal Server error", success: false, error: error.message });
        }
    }
    else {
        return res.send({ message: "Please  fill the OTP", success: false })
    }
}

// send reset password otp
const sendResetPasswordOtp = async (req, res) => {
    const { email } = req.body;
    if (email) {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) return res.send({ message: "user not found with this email", success: false });
            const otp = Math.floor(Math.random() * 1000000).toString();
            user.resetOtp = otp;
            user.resetOtpExpiresAt = Date.now() + 60 * 1000;
            await user.save();

            const mailOptions = {
                from: SENDER_EMAIL,
                to: user.email,
                subject: "OTP for resetting your password",
                // text: `Your OTP for resetting your account password is ${otp}`
                html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
            }
            transporter.sendMail(mailOptions);
            return res.send({ message: "OTP sent to your registered email", success: true })

        } catch (error) {
            return res.send({ message: "Internal server error", success: false, error: error.message });
        }
    }
}

// verify reset password otp
const veifyResetPasswordOtp = async (req, res) => {
    const { otp, newPassword, email } = req.body;
    if (otp && newPassword && email) {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) return res.send({ message: "user not found", success: false });
            if (Date.now() > user.resetOtpExpiresAt) {
                user.resetOtp = "";
                user.resetOtpExpiresAt = 0;
                await user.save();
                return res.send({ message: "OTP has expired", success: false });
            }
            if (user.resetOtp === otp) {
                bcrypt.hash(newPassword, 10, async (err, hash) => {
                    user.password = hash,
                        user.resetOtp = "",
                        user.resetOtpExpiresAt = 0
                    await user.save();
                });
                return res.send({ message: "Password resseted successfully", success: true });
            }
            else {
                return res.send({ message: "Invalid OTP", success: false });
            }
        } catch (error) {
            return res.send({ message: "Internal server error", success: false, error: error.message });
        }
    }
    else {
        return res.send({ message: "please fill the otp and password", success: false })
    }
}

// get user data
const getUserData = async (req, res) => {
    const email = req.user.email;
    if (email) {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) return res.send({ message: "user not found", success: false });
            return res.send({ message: "user found successfully", success: true, user });
        } catch (error) {
            return res.send({ message: "Internal server error", success: false });
        }
    }
}

module.exports = {
    handeSignUp,
    handleLogin,
    sendOtp,
    handleVerifyOtp,
    sendResetPasswordOtp,
    veifyResetPasswordOtp,
    getUserData
}