import { Response, Request } from "express";
import { userCreateShipment, userGetActiveOrders, userGetCompletedOrders } from "../service/shipmentsCustomer";

export const createShipment = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { 
        packageType,
        itemDescription, 
        quantity, 
        weight,
        destination, 
        origin,
        senderEmail,
        senderPhone,
        recipientEmail,
        recipientPhone 
    } = req.body;

    try {
        const result = await userCreateShipment(
            userId, 
            packageType,
            itemDescription, 
            quantity,
            weight, 
            destination, 
            origin,
            senderEmail,
            senderPhone,
            recipientEmail,
            recipientPhone
        );

        res.status(200).json({result});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({error: error.message});
    }
}

export const getActiveOrders = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const result = await userGetActiveOrders(userId);
        res.status(200).json({result});
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

export const getCompletedOrders = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const result = await userGetCompletedOrders(userId);
        res.status(200).json({result});
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}