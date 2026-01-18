import mongoose from 'mongoose';
import { Shipments } from './interfaces';

const shipmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, required: true},
    itemDescription: {type: String, required: true},
    quantity: {type: Number, required: true},
    arriveBy: {type: Date, required: true},
    destination: {type: String, required: true},
    origin: {type: String, required: true},
    completed: {type: Boolean},
    trackingNumber: {type: String},
})



export const ShipmentModel = mongoose.model<Shipments>('Shipments', shipmentSchema);