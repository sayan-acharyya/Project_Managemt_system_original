import bcrypt from "bcrypt";
import mongoose, { Mongoose } from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { type } from "os";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxLength: [30, "Name cannot exceed 30 charecters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
        ]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        select: false,
        minLength: [8, "password must be at least 8 characters long"]
    },
    role: {
        type: String,
        default: "Student",
        enum: ["Student", "Teacher", "Admin"]
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    department: {
        type: String,
        trim: true,
        default: null
    },
    experties: {
        type: [String],
        default: []
    },
    maxStudents: {
        type: Number,
        default: 10,
        min: [1, "Min Students must be at least 1"]
    },
    assignedStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null,
    }
}, { timestamps: true });


userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000 ;

    return resetToken;
}

export const User = mongoose.model("User", userSchema);




