
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
    emailVerified: Boolean
}