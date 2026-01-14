import mongoose from 'mongoose';
import { Shipments } from './interfaces';

const shipmentSchema = new mongoose.Schema({
    name: {type: String},
    itemDescription: {type: String},
    quantity: {type: Number},
    country: {type: String},
    trackingNumber: {type: String},
    arriveBy: {type: Date},
    destination: {type: String},
    origin: {type: String},
    completed: {type: Boolean}
})



export const ShipmentModel = mongoose.model<Shipments>('Shipments', shipmentSchema);