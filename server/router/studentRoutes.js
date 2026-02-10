import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import multer from "multer";
import { 
    getAvailableSupervisors, 
    getStudentProject, 
    submitProposal, 
    uploadFiles 
} from "../Controllers/studentController.js";
const router = express.Router();

router.post("/project", isAuthenticated, isAuthorized("Student"), getStudentProject);
router.post("/proposal", isAuthenticated, isAuthorized("Student"), submitProposal);
router.post(
    "/upload/:projectId",
    isAuthenticated,
    isAuthorized("Student"),
    //upload.array("files", 10), 
    //handleUploadError, 
    uploadFiles
);
router.get(
    "/fetch-supervisors",
    isAuthenticated,
    isAuthorized("Student"),
    getAvailableSupervisors
)


export default router;

