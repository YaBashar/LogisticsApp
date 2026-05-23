import { ShipmentModel, ShipmentStatus } from "../models/shipmentsModel";
import { UserModel } from "../models/userModel";
import { createNotification } from "./notifications.service";
import { NotificationType } from "../models/notificationModel";
import { ShipmentError } from "./shipmentsCustomer";

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
    throw new ShipmentError("Shipment doesnt exist");
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
    shipment.dateReceived = new Date();
    shipment.completed = true;
  } else if (currentStatus === ShipmentStatus.Received) {
    throw new ShipmentError("Cannot update status for a completed shipment");
  } else {
    throw new ShipmentError("Invalid status type");
  }

  await shipment.save();

  const user = await UserModel.findById(shipment.userId);
  if (user) {
    await createNotification({
      recipientUserId: user._id.toString(),
      shipmentId: shipment._id.toString(),
      type: NotificationType.StatusUpdate,
      message: `Your shipment order ${shipment.orderNumber} has been updated to ${shipment.status}.`,
    });
  }

  return { success: true };
}

export { allActiveOrders, updateShipmentStatus };
