import { allActiveOrders } from "../service/shipmentsAdmin"
import { Request, Response } from "express";


export const getAllActiveOrders = async(req: Request, res: Response) => {

    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    try {
        const result = await allActiveOrders(page, limit);
        res.status(200).json({result})
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}