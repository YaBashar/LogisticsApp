import { UserModel } from "../models/userModel";
import { ShipmentModel } from "../models/shipmentsModel";
import {
  validateItemDescription,
  validateLocations,
  validateQuantity,
  generateOrderNumber,
  validateWeight,
  validatePhoneNumber,
  validateEmail,
} from "../utils/shipmentsHelper";
import { sendNotification } from "./notifications.service";

// Endpoints
// 1 -> Create new shipment order

async function userCreateShipment(
  userId: string,
  packageType: string,
  itemDescription: string,
  quantity: number,
  weight: number,
  height: number,
  width: number,
  length: number,
  destination: string,
  origin: string,
  senderEmail: string,
  senderPhone: string,
  recipientEmail: string,
  recipientPhone: string
) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User Not Found");
  }

  const sanitisedDescription = itemDescription.trim().replace(/[<>]/g, "");
  const sanitisedOrigin = origin.trim().replace(/[<>]/g, "");
  const sanitisedDestination = destination.trim().replace(/[<>]/g, "");
  const sanitisedRecipientEmail = recipientEmail.trim().replace(/[<>]/g, "");
  const sanitisedSenderEmail = senderEmail.trim().replace(/[<>]/g, "");
  const sanitisedSenderPhone = senderPhone.trim().replace(/[^\d+]/g, "");
  const sanitisedRecipientPhone = recipientPhone.trim().replace(/[^\d+]/g, "");

  validateItemDescription(sanitisedDescription);
  validateQuantity(quantity);
  validateWeight(weight);
  validateEmail(sanitisedRecipientEmail);
  validateEmail(sanitisedSenderEmail);

  validatePhoneNumber(sanitisedSenderPhone);
  validatePhoneNumber(sanitisedRecipientPhone);

  validateLocations(sanitisedOrigin, sanitisedDestination);

  const shipment = new ShipmentModel({
    userId: user._id,
    orderNumber: generateOrderNumber(),
    itemDescription: sanitisedDescription,
    quantity: quantity,
    weight: weight,
    height: height,
    width: width,
    length: length,
    packageType: packageType,
    senderEmail: sanitisedSenderEmail,
    senderPhone: sanitisedSenderPhone,
    recipientEmail: sanitisedRecipientEmail,
    recipientPhone: sanitisedRecipientPhone,
    destination: sanitisedDestination,
    origin: sanitisedOrigin,
    completed: false,
    dateSubmitted: new Date(),
  });

  await shipment.save();

  const admin = await UserModel.findOne({ role: "admin" });
  if (admin) {
    await sendNotification(admin._id.toString(), {
      title: "New Shipment Created",
      body: `A new shipment order ${shipment.orderNumber} has been created.`,
      data: { shipmentId: shipment._id.toString() },
    });
  } else {
    console.warn("No admin user found to notify about new shipment.");
  }

  return shipment._id.toString();
}

async function userGetActiveOrders(
  userId: string,
  page: number,
  limit: number
) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const shipments = await ShipmentModel.find({
    userId: userId,
    completed: false,
  })
    .skip((page - 1) * limit)
    .limit(limit);

  return shipments;
}

// 5 -> View all completed orders
// Add pagination later
async function userGetCompletedOrders(
  userId: string,
  page: number,
  limit: number
) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const shipments = await ShipmentModel.find({
    userId: userId,
    completed: true,
  })
    .skip((page - 1) * limit)
    .limit(limit);

  return shipments;
}

export { userCreateShipment, userGetActiveOrders, userGetCompletedOrders };
