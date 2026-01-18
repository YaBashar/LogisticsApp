import { allActiveOrders } from "../service/shipmentsAdmin"
import { Request, Response } from "express";


export const getAllActiveOrders = async(req: Request, res: Response) => {
    try {
        const result = await allActiveOrders();
        res.status(200).json({result})
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}