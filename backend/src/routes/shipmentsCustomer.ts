import express from 'express';
import { verifyJWT } from '../middleware';

export const shipmentsCustomerRouter = express.Router();

shipmentsCustomerRouter.post('/', verifyJWT);