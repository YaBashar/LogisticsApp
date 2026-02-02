// notifications.service.ts
import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { UserModel } from "../models/userModel";
import { expo } from "../app";

interface NotificationMessage {
  title: string;
  body: string;
  data?: any;
  sound?: "default" | null;
}

export const sendNotification = async (
  userId: string,
  message: NotificationMessage
) => {
  const user = await UserModel.findById(userId);

  if (!user || !user.pushTokens.length) {
    return { success: false, error: "No tokens found" };
  }

  const messages: ExpoPushMessage[] = user.pushTokens
    .filter((token) => Expo.isExpoPushToken(token))
    .map((token) => ({
      to: token,
      sound: "default",
      ...message,
    }));

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error("Error sending push notifications:", error);
    }
  }

  // Clean up invalid tokens
  const invalidTokens: string[] = [];

  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i];
    if (ticket.status === "error") {
      if (ticket.details?.error === "DeviceNotRegistered") {
        invalidTokens.push(messages[i].to as string);
      }
    }
  }

  // Remove invalid tokens from user
  if (invalidTokens.length > 0) {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { pushTokens: { $in: invalidTokens } },
    });
  }

  return { success: true, tickets };
};

// notifications.service.ts
export const registerPushToken = async (userId: string, token: string) => {
  if (!Expo.isExpoPushToken(token)) {
    throw new Error("Invalid push token");
  }

  await UserModel.findByIdAndUpdate(userId, {
    $addToSet: { pushTokens: token },
  });

  // Future: Log to analytics, send welcome notification, etc.
  return { success: true };
};

export const removePushToken = async (userId: string, token: string) => {
  await UserModel.findByIdAndUpdate(userId, {
    $pull: { pushTokens: token },
  });

  // Future: Log logout event, cleanup related data, etc.
  return { success: true };
};
