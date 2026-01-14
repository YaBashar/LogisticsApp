
export interface User {
    userId: string;
    name: string;
    email: string;
    password: string;
    refreshTokens: string[];
    role: 'admin' | 'customer';
    loginAttempts: number,
    lockUntil: Date,
    accountLocked: Boolean,
    createdAt: Date,
    updatedAt: Date,
    verificationCode: string,
    verificationCodeExpiry: Date,
    resetCode: string,
    resetCodeExpiry: Date
    emailVerified: Boolean
}

export interface Shipments {
    name: string,
    itemDescription: string,
    quantity: number,
    country: string,
    trackingNumber: string,
    arriveBy: Date,
    destination: string,
    origin: string
}