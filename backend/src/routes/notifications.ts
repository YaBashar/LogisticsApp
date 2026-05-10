// routes/notifications.routes.ts
import express from "express";
import * as NotificationsController from "../controllers/notifications.controller";
import { requireAuth } from "../middleware";

const NotificationRouter = express.Router();

// Register token
NotificationRouter.post("/register-token", requireAuth, NotificationsController.registerToken);

// Remove token (when user logs out)
NotificationRouter.post("/remove-token", requireAuth, NotificationsController.removeToken);

// Send notification to a user
NotificationRouter.post("/send/:userId", requireAuth, NotificationsController.sendNotif);

export default NotificationRouter;
