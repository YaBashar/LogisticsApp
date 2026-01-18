import express from 'express';
import { Router } from "express";
import * as adminShipmentsController from '../controllers/shipmentsAdmin.controller';
import { verifyJWT } from '../middleware';

export const shipmentsAdminRouter = express.Router(); 

shipmentsAdminRouter.get('/active', verifyJWT, adminShipmentsController.getAllActiveOrders)