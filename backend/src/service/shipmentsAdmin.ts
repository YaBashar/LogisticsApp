import { ShipmentModel } from "../models/shipmentsModel";


async function allActiveOrders(page: number, limit: number) {
    const shipments = await ShipmentModel
        .find({completed: false})
        .populate('userId', 'name')
        .skip((page - 1) * limit)
        .limit(limit);

    console.log(shipments);
    return shipments;
}

export { allActiveOrders }