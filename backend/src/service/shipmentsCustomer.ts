import { UserModel } from "../models/userModel"
import { ShipmentModel } from "../models/shipmentsModel"
import { validateName, validateItemDescription, validateArriveBy, validateLocations, validateQuantity } from "../utils/shipmentsHelper"; 

// Endpoints
// 1 -> Create new shipment order
async function userCreateShipment(userId: string, name: string, itemDescription: string, quantity: number, 
                                    arriveBy: Date, destination: string, origin: string) {
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
    validateArriveBy(arriveBy);
    validateLocations(sanitisedOrigin, sanitisedDestination);
    
    const shipment = new ShipmentModel({
        name: sanitisedName,
        itemDescription: sanitisedDescription,
        quantity: quantity,
        arriveBy: arriveBy,
        destination: destination,
        origin: origin,
        completed: false
    });

    await shipment.save()
    return shipment._id.toString()
}

// 2 -> Edit Shipment order (only allow before admin approves) 
// 3 -> Delete Shipment order (only allow before admin approves)
// 4 -> View all active orders 
// 5 -> View all completed orders

export { userCreateShipment }