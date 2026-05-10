import express from "express";
import * as adminShipmentsController from "../controllers/shipmentsAdmin.controller";
import { requireAuth, requireAdmin } from "../middleware";

export const shipmentsAdminRouter = express.Router();

shipmentsAdminRouter.put("/:shipmentId/status", requireAuth, requireAdmin, adminShipmentsController.updateStatus);
shipmentsAdminRouter.get("/active", requireAuth, requireAdmin, adminShipmentsController.getAllActiveOrders);
