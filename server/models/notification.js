import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        maxlength: [1000, "Message can't be more then 1000 characters"],
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    link: {
        type: String,
        default: null
    },
    type: {
        type: String,
        enum: [
            "request",
            "approval",
            "rejection",
            "feedback",
            "deadline",
            "general",
            "meeting",
            "system"
        ],
        default: "general",
    },
    priority: {
        type: String,
        enum: ["high", "medium", "low"],
        default: "low"
    }
}, { timestamps: true })

//Indexing for better query performence

notificationSchema.index({ user: 1, isRead:1 });
 
export const Notification = mongoose.model("Notification", notificationSchema);