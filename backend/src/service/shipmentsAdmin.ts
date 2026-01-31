import { ShipmentModel } from "../models/shipmentsModel";

async function allActiveOrders(page: number, limit: number) {
  const shipments = await ShipmentModel.find({ completed: false })
    .populate("userId", "name")
    .skip((page - 1) * limit)
    .limit(limit);

  return shipments;
}

async function updateShipmentStatus(shipmentId: string, status: string) {
  const shipment = await ShipmentModel.findById(shipmentId);
  if (!shipment) {
    throw new Error("Shipment doesnt exist");
  }

  const validStates = ["Pending", "Picked", "Shipped", "Delivered", "Received"];
  if (!validStates.includes(status)) {
    throw new Error("Invalid Status type");
  }

  shipment.status = status;
  await shipment.save();

  return { success: true };
}

export { allActiveOrders, updateShipmentStatus };
