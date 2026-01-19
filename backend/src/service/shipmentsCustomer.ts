import { UserModel } from "../models/userModel"
import { ShipmentModel } from "../models/shipmentsModel"
import { validateName, validateItemDescription, validateLocations, validateQuantity } from "../utils/shipmentsHelper"; 

// Endpoints
// 1 -> Create new shipment order

// Change arriveBy back to date after fix on frontend
async function userCreateShipment(userId: string, name: string, itemDescription: string, quantity: number, 
                                    destination: string, origin: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error('User Not Found');
    }

    const sanitisedName = name.trim().replace(/[<>]/g, '');
    const sanitisedDescription = itemDescription.trim().replace(/[<>]/g, '')
    const sanitisedOrigin = origin.trim().replace(/[<>]/g, '');
    const sanitisedDestination = destination.trim().replace(/[<>]/g, '');

    validateName(sanitisedName);
    validateItemDescription(sanitisedDescription);
    validateQuantity(quantity);
    validateLocations(sanitisedOrigin, sanitisedDestination);
    
    const shipment = new ShipmentModel({
        userId: user._id,
        name: sanitisedName,
        itemDescription: sanitisedDescription,
        quantity: quantity,
        destination: sanitisedDestination,
        origin: sanitisedOrigin,
        completed: false
    });

    await shipment.save();
    return shipment._id.toString();
}

// 2 -> Edit Shipment order (only allow before admin approves) 
// 3 -> Delete Shipment order (only allow before admin approves)


// 4 -> View all active orders 
async function userGetActiveOrders(userId: string) {
    const user = UserModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const shipments = await ShipmentModel.find({
        userId: userId,
        completed: false
    }).sort({ arriveBy: 1})

    return shipments;
}

// 5 -> View all completed orders
async function userGetCompletedOrders(userId: string) {
    const user = UserModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const shipments = ShipmentModel.find({
        userId: userId,
        completed: true
    })

    return shipments;
}

export { userCreateShipment, userGetActiveOrders, userGetCompletedOrders }