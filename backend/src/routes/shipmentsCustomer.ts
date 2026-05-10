import express from "express";
import { requireAuth } from "../middleware";
import * as ShipmentsController from "../controllers/shipmentsCustomer.controller";

export const shipmentsCustomerRouter = express.Router();

shipmentsCustomerRouter.post("/", requireAuth, ShipmentsController.createShipment);
shipmentsCustomerRouter.get("/active", requireAuth, ShipmentsController.getActiveOrders);
shipmentsCustomerRouter.get("/completed", requireAuth, ShipmentsController.getCompletedOrders);
