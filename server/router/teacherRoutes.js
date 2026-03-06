import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { getRequests, getTeacherDashboardStats, acceptRequest, rejectRequest, addFeedback, markComplete, getAssignedStudents, downloadFile, getFiles } from "../Controllers/teacherController.js"
const router = express.Router();

router.get(
    "/fetch-dashboard-stats",
    isAuthenticated,
    isAuthorized("Teacher"),
    getTeacherDashboardStats
);

router.get(
    "/requests",
    isAuthenticated,
    isAuthorized("Teacher"),
    getRequests
);

router.put(
    "/requests/:requestId/accept",
    isAuthenticated,
    isAuthorized("Teacher"),
    acceptRequest
);

router.put(
    "/requests/:requestId/reject",
    isAuthenticated,
    isAuthorized("Teacher"),
    rejectRequest
);

router.post(
    "/mark-complete/:projectId",
    isAuthenticated,
    isAuthorized("Teacher"),
    markComplete
);

router.post(
    "/feedback/:projectId",
    isAuthenticated,
    isAuthorized("Teacher"),
    addFeedback
)

router.get(
    "/assigned-students",
    isAuthenticated,
    isAuthorized("Teacher"),
    getAssignedStudents
)

router.get(
    "/:projectId/files/:fileId/download",
    isAuthenticated,
    isAuthorized("Teacher"),
    downloadFile
);

router.get(
    "/files",
    isAuthenticated,
    isAuthorized("Teacher"),
    getFiles
);
export default router;
