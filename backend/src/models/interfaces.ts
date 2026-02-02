export interface User {
  userId: string;
  name: string;
  email: string;
  password: string;
  refreshTokens: string[];
  pushTokens: string[];
  role: "admin" | "customer";
  loginAttempts: number;
  lockUntil: Date;
  accountLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  verificationCode: string;
  verificationCodeExpiry: Date;
  resetCode: string;
  resetCodeExpiry: Date;
  emailVerified: boolean;
}

export interface Shipments {
  userId: string;
  orderNumber: number;
  itemDescription: string;
  quantity: number;
  weight: number;
  packageType: string;
  status: string;
  senderEmail: string;
  senderPhone: string;
  recipientPhone: string;
  destination: string;
  origin: string;
  completed: boolean;
  trackingNumber: string;
}

export interface NotificationMessage {
  title: string;
  body: string;
  data?: any;
  sound?: "default" | null;
}
