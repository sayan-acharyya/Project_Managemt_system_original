import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.model.js";
import * as userServices from "../services/userServices.js";
import * as projectServices from "../services/projectServices.js"
import * as requestService from "../services/requestServices.js"
import * as notificationService from "../services/notificationServices.js"
import { Project } from "../models/Project.js";
import { Notification } from "../models/notification.js";
import * as fileServices from "../services/fileServices.js";
import { title } from "process";
import { type } from "os";
import { SupervisorRequest } from "../models/supervisorRequest.js";

export const getTeacherDashboardStats = asyncHandler(async (req, res, next) => {
    const teacherId = req.user._id;

    const totalPendingRequests = await SupervisorRequest.countDocuments({
        supervisor: teacherId,
        status: "pending"
    });

    const completedProjects = await Project.countDocuments({
        supervisor: teacherId,
        status: "completed"
    });

    const recentNotifications = await Notification.find({
        user: teacherId,
    })
        .sort({ createdAt: -1 })
        .limit(5);

    const dashboardStats = {
        totalPendingRequests,
        completedProjects,
        recentNotifications
    };

    res.status(200).json({
        success: true,
        message: "Dashboard stats fetched for teacher successfully",
        data: { dashboardStats }
    });
});

export const getRequests = asyncHandler(async (req, res, next) => {
 //21:35:22

})

// export const getRequests = asyncHandler(async (req, res, next) => {

// })

// export const getRequests = asyncHandler(async (req, res, next) => {

// })