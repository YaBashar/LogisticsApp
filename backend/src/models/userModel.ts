import mongoose from "mongoose";
import { User } from "./interfaces";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    refreshTokens: { type: [String], default: [] },
    role: { 
        type: String, 
        enum: ['admin', 'customer'],  
        default: 'customer'            
    }
})

export const UserModel = mongoose.model<User>('User', userSchema);