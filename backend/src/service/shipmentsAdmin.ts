import { ShipmentModel } from "../models/shipmentsModel";


async function allActiveOrders() {
    const shipments = await ShipmentModel.find({completed: false})
        .populate('userId', 'name');
    console.log(shipments);
    return shipments;
}

export { allActiveOrders }