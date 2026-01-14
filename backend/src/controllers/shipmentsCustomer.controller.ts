import { Response, Request } from "express";
import { userCreateShipment } from "../service/shipmentsCustomer";

export const createShipment = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { name, itemDescription, quantity, arriveBy, destination, origin } = req.body;

    try {
        const result = await userCreateShipment(userId, name, itemDescription, quantity, arriveBy, destination, origin);
        res.status(200).json({result});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}