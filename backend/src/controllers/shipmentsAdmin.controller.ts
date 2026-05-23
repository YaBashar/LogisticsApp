import { allActiveOrders, updateShipmentStatus } from "../service/shipmentsAdmin";
import { Request, Response, NextFunction } from "express";

export const getAllActiveOrders = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);

  try {
    const result = await allActiveOrders(page, limit);
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  const shipmentId = req.params.shipmentId as string;

  try {
    const result = await updateShipmentStatus(shipmentId);
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};
