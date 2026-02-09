import mongoose from "mongoose";

const deadlineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Deadline name/title is required"],
        maxlength: [100, "Deadline name/title can't be more then 100 characters"],
        trim: true
    },
    dueDate: {
        type: Date,
        required: [true, "Due Date is required"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "createdBy is required"]
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null
    },

}, { timestamps: true })

//Indexing for better query performence

deadlineSchema.index({ dueDate: 1 });
deadlineSchema.index({ project: 1 });
deadlineSchema.index({ createdBy: 1 });

export const Deadline = mongoose.model("Deadline", deadlineSchema);