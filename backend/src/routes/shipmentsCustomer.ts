import express from 'express';
import { verifyJWT } from '../middleware';
import * as ShipmentsController from '../controllers/shipmentsCustomer.controller'

export const shipmentsCustomerRouter = express.Router();

shipmentsCustomerRouter.post('/', verifyJWT, ShipmentsController.createShipment);