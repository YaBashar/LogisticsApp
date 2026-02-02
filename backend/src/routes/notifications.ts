// routes/notifications.routes.ts
import express from "express";
import * as NotificationsController from "../controllers/notifications.controller";
import { verifyJWT } from "../middleware";

const NotificationRouter = express.Router();

// Register token
NotificationRouter.post(
  "/register-token",
  verifyJWT,
  NotificationsController.registerToken
);

// Remove token (when user logs out)
NotificationRouter.post(
  "/remove-token",
  verifyJWT,
  NotificationsController.removeToken
);

// Send notification to a user
NotificationRouter.post(
  "/send/:userId",
  verifyJWT,
  NotificationsController.sendNotif
);

export default NotificationRouter;
