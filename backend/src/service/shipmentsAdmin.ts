import { ShipmentModel, ShipmentStatus } from "../models/shipmentsModel";
import { UserModel } from "../models/userModel";
import { sendNotification } from "./notifications.service";

async function allActiveOrders(page: number, limit: number) {
  const shipments = await ShipmentModel.find({ completed: false })
    .populate("userId", "name")
    .skip((page - 1) * limit)
    .limit(limit);

  return shipments;
}

async function updateShipmentStatus(shipmentId: string) {
  const shipment = await ShipmentModel.findOne({
    _id: shipmentId,
    completed: false,
  });

  if (!shipment) {
    throw new Error("Shipment doesnt exist");
  }

  const currentStatus = shipment.status;

  if (currentStatus === ShipmentStatus.Pending) {
    shipment.status = ShipmentStatus.Picked;
    shipment.datePicked = new Date();
  } else if (currentStatus === ShipmentStatus.Picked) {
    shipment.status = ShipmentStatus.Shipped;
    shipment.dateShipped = new Date();
  } else if (currentStatus === ShipmentStatus.Shipped) {
    shipment.status = ShipmentStatus.Delivered;
    shipment.dateDelivered = new Date();
  } else if (currentStatus === ShipmentStatus.Delivered) {
    shipment.status = ShipmentStatus.Received;
    shipment.dateRecieved = new Date();
    shipment.completed = true;
  } else if (currentStatus === ShipmentStatus.Received) {
    throw new Error("Cannot update status for a completed shipment");
  } else {
    throw new Error("Invalid status type");
  }

  await shipment.save();

  const user = await UserModel.findById(shipment.userId);
  await sendNotification(user._id.toString(), {
    title: "Shipment Status Updated",
    body: `Your shipment with order number ${shipment.orderNumber} is now ${shipment.status}`,
    data: { shipmentId: shipment._id.toString() },
  });

  return { success: true };
}

export { allActiveOrders, updateShipmentStatus };
