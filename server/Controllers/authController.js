import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utills/generateToken.js";
import { generateForgotPasswordEmailTemplate } from "../utills/Email_Templates.js";
import { sendEmail } from "../services/emailService.js";
import crypto from "crypto"

//Register user
export const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        return next(new ErrorHandler("Please provide all required feilds", 400));
    }
    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("user already exist with this email", 400));
    }
    const newPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: newPassword, role });
    await user.save();
    generateToken(user, 201, "User registered successfully", res);
})
//Login user 
export const login = asyncHandler(async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid credentials ", 401));
    }

    // ✅ Role check
    if (user.role !== role) {
        return next(new ErrorHandler("Invalid credentials ", 401));
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid credentials ", 401));
    }

    generateToken(user, 200, "Logged in successfully", res);
});

export const getUser = asyncHandler(async (req, res, next) => {

    const user = req.user;
    res.status(200).json({
        success: true,
        user
    })
})

export const logout = asyncHandler(async (req, res, next) => {
    res.status(200).cookie("token", " ", {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: "Logged out Succesfully"
    })
})

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

    const message = generateForgotPasswordEmailTemplate(resetPasswordUrl)

    try {
        await sendEmail({
            to: user.email,
            subject: "Project Management Syatem - Password Reset Request",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} succesfully`,
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message || "can't send email", 500));
    }
})

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler("Invalid or expired password reset token", 400));
    }

    if (!req.body.password || !req.body.confirmPassword) {
        return next(new ErrorHandler("Please provide all required feilds", 400));
    }

    if (req.body.password != req.body.confirmPassword) {
        return next(new ErrorHandler("password and confirmPassword do not match", 400));
    }
      const hashedPassword = await bcrypt.hash( req.body.confirmPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();
    generateToken(user, 200, "Password reset successful", res);
    
})