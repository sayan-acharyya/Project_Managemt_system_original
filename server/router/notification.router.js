import express from "express"
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import {
    deleteNotification,
    getNotifications,
    markAllAsRead,
    markAsRead
} from "../Controllers/notificationController.js"
const router = express.Router();

router.get("/", isAuthenticated, getNotifications);
router.put("/read-all", isAuthenticated, markAllAsRead);
router.put("/:id/read", isAuthenticated, markAsRead);
router.delete("/:id/delete", isAuthenticated, deleteNotification);

export default router;
