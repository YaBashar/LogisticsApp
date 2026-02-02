import { Request, Response } from "express";
import {
  registerPushToken,
  removePushToken,
  sendNotification,
} from "../service/notifications.service";

export const registerToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  const userId = req.userId;

  try {
    const result = await registerPushToken(userId, token);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const sendNotif = async (req: Request, res: Response) => {
  const { title, body, data } = req.body;
  const userId = req.params.userId as string;

  try {
    const result = await sendNotification(userId, {
      title,
      body,
      data,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  const userId = req.userId;

  try {
    const result = await removePushToken(userId, token);
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
