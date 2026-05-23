import { Expo } from "expo-server-sdk";
import { Types } from "mongoose";
import { UserModel } from "../models/userModel";
import {
  NOTIFICATION_LIST_LIMIT,
  NotificationModel,
  NotificationType,
} from "../models/notificationModel";
import { ShipmentModel } from "../models/shipmentsModel";

type NotificationLean = {
  _id: Types.ObjectId;
  recipientUserId: Types.ObjectId;
  shipmentId: Types.ObjectId;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Date;
};

const expo = new Expo();

export class NotificationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

interface CreateNotificationInput {
  recipientUserId: string;
  shipmentId: string;
  type: NotificationType;
  message: string;
}

export const createNotification = async (input: CreateNotificationInput) => {
  await NotificationModel.create({
    recipientUserId: input.recipientUserId,
    shipmentId: input.shipmentId,
    type: input.type,
    message: input.message,
    read: false,
  });

  // Best-effort push — never throws, DB notification is source of truth
  try {
    const user = await UserModel.findById(input.recipientUserId).select("pushToken").lean();
    const token = user?.pushToken;
    if (token && Expo.isExpoPushToken(token)) {
      await expo.sendPushNotificationsAsync([
        {
          to: token,
          title: "Logistics",
          body: input.message,
          data: {
            type: input.type,
            shipmentId: input.shipmentId,
          },
        },
      ]);
    }
  } catch {
    // Push failure is non-fatal
  }
};

export async function markAllNotificationsRead(userId: string): Promise<number> {
  if (!userId) throw new NotificationError("Authentication Required", 401);

  const result = await NotificationModel.updateMany(
    { recipientUserId: userId, read: false },
    { $set: { read: true } }
  );

  return result.modifiedCount;
}


export const registerPushToken = async (userId: string, token: string) => {
  if (!Expo.isExpoPushToken(token)) {
    throw new Error("Invalid push token");
  }

  await UserModel.findByIdAndUpdate(userId, {
    $set: { pushToken: token },
  });

  return { success: true };
};

export async function getNotificationsForUser(userId: string) {
  if (!userId) throw new NotificationError("Authentication Required", 401);

  const notifications = (await NotificationModel.find({ recipientUserId: userId })
    .sort({ createdAt: -1 })
    .limit(NOTIFICATION_LIST_LIMIT)
    .lean()) as NotificationLean[];

  const shipmentIds = [...new Set(notifications.map((n) => n.shipmentId.toString()))];

  const shipments =
    shipmentIds.length > 0
      ? await ShipmentModel.find({ _id: { $in: shipmentIds } })
          .select("orderNumber")
          .lean()
      : [];

  const orderNumberByShipmentId = new Map(
    shipments.map((s) => [s._id.toString(), s.orderNumber as number])
  );

  return notifications.map((n) => {
    const shipmentId = n.shipmentId.toString();
    return {
      id: n._id.toString(),
      recipientUserId: n.recipientUserId.toString(),
      shipmentId,
      orderNumber: orderNumberByShipmentId.get(shipmentId) ?? null,
      type: n.type,
      message: n.message,
      read: n.read,
      createdAt: n.createdAt,
    };
  });
}

export const removePushToken = async (userId: string, token: string) => {
  await UserModel.findOneAndUpdate(
    { _id: userId, pushToken: token },
    { $unset: { pushToken: "" } }
  );

  return { success: true };
};
