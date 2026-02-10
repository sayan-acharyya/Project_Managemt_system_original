import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.model.js";
import * as userServices from "../services/userServices.js";
import * as projectServices from "../services/projectServices.js"



export const getStudentProject = asyncHandler(async (req, res, next) => {
    const studentId = req.user._id;

    const project = await projectServices.getProjectByStudentId(studentId);

    if (!project) {
        return res.status(200).json({
            success: true,
            data: { project: null },
            message: "No project found for this student"
        })
    }
    return res.status(200).json({
        success: true,
        data: { project },

    })

})

export const submitProposal = asyncHandler(async (req, res, next) => {
    const { title, description } = req.body;
    const studentId = req.user._id;

    const existingProject = await projectServices.getProjectByStudentId(studentId);

    if (existingProject && existingProject.status !== "rejected") {
        return next(new ErrorHandler("You already have an active project.You submit a new Proposal when the previous one was rejected.", 400))
    }
    const projectData = {
        student: studentId,
        title,
        description,
    }
    const project = await projectServices.createProject(projectData);

    await User.findByIdAndUpdate(studentId, { project: project._id });

    res.status(201).json({
        success: true,
        data: { project },
        message: "Project proposal submitted successfully"
    })
})

export const uploadFiles = asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    const studentId = req.user._id;
    const project = await projectServices.getProjectById(projectId);

    if (!project || project.student.toString() !== studentId.toString()) {
        return next(new ErrorHandler("Not authorized to upload files to this project", 403));
    }
    if (!req.files || req.files.length === 0) {
        return next(new ErrorHandler("No files uploaded", 400))
    }

    const updatedProject = await projectServices.addFilesToProject(
        projectId,
        req.files
    );
    res.status(200).json({
        success: true,
        message: "files uploaded successfully.",
        data: { project: updatedProject }
    })
})

export const getAvailableSupervisors = asyncHandler(async (req, res, next) => {
    const supervisors = await User.find({ role: "Teacher" })
        .select("name email department experties")
        .lean();

    res.status(200).json({
        success: true,
        data: { supervisors },
        message: "Available supervisors fetched successfully",
    })



})

