import mongoose from 'mongoose';
import { Shipments } from './interfaces';

const shipmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    orderNumber: {type: Number, required: true},
    itemDescription: {type: String, required: true},
    quantity: {type: Number, required: true},
    weight: {type: Number, required: true},
    height: { type: Number, required: true},
    width: { type: Number, required: true},
    length: { type: Number, required: true},
    packageType: {
        type: String,
        enum: ['pallet', 'crate', 'box']
    },
    status: {
        type: String,
        enum: ['Pending', 'Picked', 'Shipped', 'Delivered', 'Received']
    },
    senderEmail: {type: String, required: true},
    senderPhone: {type: String, required: true},
    recipientEmail: {type: String, required: true},
    recipientPhone: {type: String, required: true},
    destination: {type: String, required: true},
    origin: {type: String, required: true},
    completed: {type: Boolean},
    trackingNumber: {type: String},
})



export const ShipmentModel = mongoose.model<Shipments>('Shipments', shipmentSchema);