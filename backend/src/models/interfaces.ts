
export interface User {
    userId: string;
    name: string;
    email: string;
    password: string;
    refreshTokens: string[];
    role: 'admin' | 'customer';
}