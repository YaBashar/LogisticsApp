import { Response, Request } from "express";
import {
  userCreateShipment,
  userGetActiveOrders,
  userGetCompletedOrders,
} from "../service/shipmentsCustomer";

export const createShipment = async (req: Request, res: Response) => {
  const userId = req.user!.sub;
  const {
    packageType,
    itemDescription,
    quantity,
    weight,
    height,
    width,
    length,
    destination,
    origin,
    senderEmail,
    senderPhone,
    recipientEmail,
    recipientPhone,
  } = req.body;

  try {
    const result = await userCreateShipment(
      userId,
      packageType,
      itemDescription,
      quantity,
      weight,
      height,
      width,
      length,
      destination,
      origin,
      senderEmail,
      senderPhone,
      recipientEmail,
      recipientPhone
    );

    res.status(200).json({ result });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getActiveOrders = async (req: Request, res: Response) => {
  const userId = req.user!.sub;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);

  try {
    const result = await userGetActiveOrders(userId, page, limit);
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCompletedOrders = async (req: Request, res: Response) => {
  const userId = req.user!.sub;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);

  try {
    const result = await userGetCompletedOrders(userId, page, limit);
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
