import mongoose from "mongoose";
import { User } from "./interfaces";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true},
    refreshTokens: { type: [String], default: [] },
    role: { 
        type: String, 
        enum: ['admin', 'customer'],  
        default: 'customer'            
    },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    accountLocked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    verificationCode: { type: String, unique: true },
    verificationCodeExpiry: { type: Date }, 
    resetCode: { type: String },
    resetCodeExpiry: { type: Date },
    emailVerified: { type: Boolean, default: false },

    shipments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipments'
    }]
})

export const UserModel = mongoose.model<User>('User', userSchema);