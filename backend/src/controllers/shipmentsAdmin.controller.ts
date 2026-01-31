import {
  allActiveOrders,
  updateShipmentStatus,
} from "../service/shipmentsAdmin";
import { Request, Response } from "express";

export const getAllActiveOrders = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);

  try {
    const result = await allActiveOrders(page, limit);
    console.log(result);
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const shipmentId = req.params.shipmentId as string;

  try {
    const result = await updateShipmentStatus(shipmentId, status);
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
