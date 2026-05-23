import { Request, Response, NextFunction } from "express";
import {
  getNotificationsForUser,
  markAllNotificationsRead,
  registerPushToken,
  removePushToken,
} from "../service/notifications.service";

export const registerToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  const userId = req.user!.sub;

  try {
    const result = await registerPushToken(userId, token);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.sub;
    const notifications = await getNotificationsForUser(userId);
    res.status(200).json({ success: true, notifications });
  } catch (err) {
    next(err);
  }
}

export async function readAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.sub;
    const updatedCount = await markAllNotificationsRead(userId);
    res.status(200).json({ success: true, updatedCount });
  } catch (err) {
    next(err);
  }
}


export const removeToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  const userId = req.user!.sub;

  try {
    const result = await removePushToken(userId, token);
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
