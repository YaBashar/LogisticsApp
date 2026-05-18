import mongoose, { Document } from "mongoose";

// Add date for timeline
// Use interface
// Use enum as const for status types

export const ShipmentStatus = {
  Pending: "Pending",
  Picked: "Picked",
  Shipped: "Shipped",
  Delivered: "Delivered",
  Received: "Received",
} as const;

export type ShipmentStatus = (typeof ShipmentStatus)[keyof typeof ShipmentStatus];

export interface Shipment extends Document {
  userId: mongoose.Types.ObjectId;
  orderNumber: number;
  itemDescription: string;
  quantity: number;
  weight: number;
  height: number;
  width: number;
  length: number;
  packageType: "pallet" | "crate" | "box";
  status: ShipmentStatus;
  senderEmail: string;
  senderPhone: string;
  recipientEmail: string;
  recipientPhone: string;
  destination: string;
  origin: string;
  completed?: boolean;
  trackingNumber?: string;
  dateSubmitted: Date;
  datePicked?: Date;
  dateShipped?: Date;
  dateDelivered?: Date;
  dateRecieved?: Date;
}

const shipmentSchema = new mongoose.Schema<Shipment>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderNumber: { type: Number, required: true },
  itemDescription: { type: String, required: true },
  quantity: { type: Number, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  length: { type: Number, required: true },
  packageType: {
    type: String,
    enum: ["pallet", "crate", "box"],
  },
  status: {
    type: String,
    enum: Object.values(ShipmentStatus),
    default: "Pending",
  },
  senderEmail: { type: String, required: true },
  senderPhone: { type: String, required: true },
  recipientEmail: { type: String, required: true },
  recipientPhone: { type: String, required: true },
  destination: { type: String, required: true },
  origin: { type: String, required: true },
  completed: { type: Boolean },
  trackingNumber: { type: String },
  dateSubmitted: { type: Date },
  datePicked: { type: Date },
  dateShipped: { type: Date },
  dateDelivered: { type: Date },
  dateRecieved: { type: Date },
});

export const ShipmentModel = mongoose.model<Shipment>("Shipments", shipmentSchema);
