import { Response, Request } from "express";
import { userCreateShipment, userGetActiveOrders, userGetCompletedOrders } from "../service/shipmentsCustomer";

export const createShipment = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { name, itemDescription, quantity, arriveBy, destination, origin } = req.body;
    const arriveByDate = new Date(arriveBy)

    try {
        const result = await userCreateShipment(userId, name, itemDescription, quantity, arriveByDate, destination, origin);
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