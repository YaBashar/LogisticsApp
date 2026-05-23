import mongoose, { Document, Schema, Types } from "mongoose";

/** Notifications older than this are removed by a MongoDB TTL index on `createdAt`. */
export const NOTIFICATION_RETENTION_DAYS = 30;

/** Maximum notifications returned per user (newest first). */
export const NOTIFICATION_LIST_LIMIT = 50;

export const NotificationType = {
  NewShipment: "NewShipment",
  StatusUpdate: "StatusUpdate",
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export interface Notification extends Document {
  recipientUserId: Types.ObjectId;
  shipmentId: Types.ObjectId;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<Notification>(
  {
    recipientUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    shipmentId: { type: Schema.Types.ObjectId, ref: "Shipment", required: true },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    message: { type: String, required: true },
    read: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: NOTIFICATION_RETENTION_DAYS * 24 * 60 * 60 }
);

NotificationSchema.index({ recipientUserId: 1, createdAt: -1 });

export const NotificationModel = mongoose.model<Notification>("Notification", NotificationSchema);
