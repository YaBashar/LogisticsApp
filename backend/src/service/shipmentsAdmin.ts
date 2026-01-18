import { ShipmentModel } from "../models/shipmentsModel";


async function allActiveOrders() {
    const shipments = await ShipmentModel.find({completed: false});
    console.log(shipments);
    return shipments;
}

export { allActiveOrders }