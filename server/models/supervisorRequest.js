import mongoose from "mongoose";

const supervisorRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Student Id is required"]
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Supervisor Id is required"]
    },
    message: {
        type: String,
        required: [true, "message is required"],
        trim: true,
        maxlength: [250, "Message can't be more then 250 characters"]
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "accepted", "rejected"]
    },

}, { timestamps: true })

//Indexing for better query performence

supervisorRequestSchema.index({ student: 1 });
supervisorRequestSchema.index({ supervisor: 1 });
supervisorRequestSchema.index({ status: 1 });

export const SupervisorRequest = mongoose.model("SupervisorRequest", supervisorRequestSchema);