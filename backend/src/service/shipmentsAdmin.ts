import { ShipmentModel } from "../models/shipmentsModel";
import { UserModel } from "../models/userModel";
import { sendNotification } from "./notifications.service";

async function allActiveOrders(page: number, limit: number) {
  const shipments = await ShipmentModel.find({ completed: false })
    .populate("userId", "name")
    .skip((page - 1) * limit)
    .limit(limit);

  return shipments;
}

async function updateShipmentStatus(shipmentId: string, status: string) {
  const shipment = await ShipmentModel.findOne({
    _id: shipmentId,
    completed: false,
  });

  if (!shipment) {
    throw new Error("Shipment doesnt exist");
  }

  const validStates = ["Pending", "Picked", "Shipped", "Delivered", "Received"];
  if (!validStates.includes(status)) {
    throw new Error("Invalid Status type");
  }

  shipment.status = status;
  if (status === "Recieved") {
    shipment.completed = true;
  }
  await shipment.save();

  const user = await UserModel.findById(shipment.userId);
  await sendNotification(user.userId, {
    title: "Shipment Status Updated",
    body: `Your shipment with order number ${shipment.orderNumber} is now ${status}`,
    data: { shipmentId: shipment._id.toString() },
  });

  return { success: true };
}

export { allActiveOrders, updateShipmentStatus };
