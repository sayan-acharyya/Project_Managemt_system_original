import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { createDeadline } from "../Controllers/deadlineController.js"
const router = express.Router();

router.post("/create-deadline/:id", isAuthenticated, isAuthorized("Admin-Teacher"), createDeadline);

export default router;