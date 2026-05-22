import request from "supertest";
import bcrypt from "bcrypt";
import { app } from "../app";
import { UserModel } from "../models/userModel";

// Clear
export const requestDelete = async () => {
  return await request(app).delete("/clear");
};

// Auth
export const requestRegister = async (
  firstName: string,
  lastName: string,
  password: string,
  email: string
) => {
  const body: Record<string, string> = { firstName, lastName, password, email };
  return await request(app).post("/auth/register").send(body);
};

export const requestLogin = async (email: string, password: string) => {
  return await request(app).post("/auth/login").send({ email, password });
};

export const requestRefresh = async (token: string) => {
  return await request(app).post("/auth/refresh").send({ refreshToken: token });
};

export const requestVerifyEmail = async (verificationCode: string) => {
  return await request(app).post("/auth/verify-email").send({ verificationCode });
};

export const requestResendVerifyEmail = async (email: string) => {
  return await request(app).post("/auth/resend-verification").send({ email });
};

export const requestForgot = async (email: string) => {
  return await request(app).post("/auth/forgot-password").send({ email });
};

export const requestResendResetCode = async (email: string) => {
  return await request(app).post("/auth/resend-reset-code").send({ email });
};

export const requestVerifyResetCode = async (resetCode: string) => {
  return await request(app).post("/auth/verify-reset-code").send({ resetCode });
};

export const requestResetPassword = async (resetCode: string, newPassword: string) => {
  return await request(app).post("/auth/reset-password").send({ resetCode, newPassword });
};

export const requestChangePassword = async (
  token: string,
  currentPassword: string,
  newPassword: string
) => {
  return await request(app)
    .post("/auth/change-password")
    .set("Authorization", `Bearer ${token}`)
    .send({ currentPassword, newPassword });
};

export const requestLogout = async (token: string) => {
  return await request(app).post("/auth/logout").set("Authorization", `Bearer ${token}`);
};

export const requestDeleteAccount = async (token: string) => {
  return await request(app).delete("/auth/delete-account").set("Authorization", `Bearer ${token}`);
};

export const requestReactivateAccount = async (email: string, password: string) => {
  return await request(app).post("/auth/reactivate").send({ email, password });
};

export const requestProfile = async (token: string) => {
  return await request(app).get("/auth/profile").set("Authorization", `Bearer ${token}`);
};

export async function getToken(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<string> {
  const reg = await requestRegister(firstName, lastName, password, email);
  expect(reg.status).toBe(201);
  await verifyEmail(email, reg.body.code);

  const loginResponse = await requestLogin(email, password);
  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.accessToken).toBeDefined();
  return loginResponse.body.accessToken;
}

export async function verifyEmail(email: string, verificationCode: string): Promise<void> {
  const response = await requestVerifyEmail(verificationCode);
  expect(response.statusCode).toBe(200);

  const updatedUser = await UserModel.findOne({ email });
  expect(updatedUser?.emailVerified).toBe(true);
  expect(updatedUser?.verificationCode).toBe(undefined);
}

// ShipmentCustomers
export const requestNewShipment = async (
  token: string,
  packageType: string,
  itemDescription: string,
  quantity: number,
  weight: number,
  height: number,
  width: number,
  length: number,
  destination: string,
  origin: string,
  senderEmail: string,
  senderPhone: string,
  recipientEmail: string,
  recipientPhone: string
) => {
  return await request(app)
    .post("/shipments-customer/")
    .send({
      packageType,
      itemDescription,
      quantity,
      weight,
      height,
      width,
      length,
      origin,
      destination,
      senderEmail,
      senderPhone,
      recipientEmail,
      recipientPhone,
    })
    .set("Authorization", `Bearer ${token}`);
};

export const requestCompletedShipments = async (token: string, page: number, limit: number) => {
  return await request(app)
    .get("/shipments-customer/completed")
    .query({ page, limit })
    .set("Authorization", `Bearer ${token}`);
};

export const requestActiveShipments = async (token: string, page: number, limit: number) => {
  return await request(app)
    .get("/shipments-customer/active")
    .set("Authorization", `Bearer ${token}`)
    .query({ page, limit });
};

// Admin
export const requestAllActiveShipments = async (token: string, page: number, limit: number) => {
  return await request(app)
    .get("/shipments-admin/active")
    .query({ page, limit })
    .set("Authorization", `Bearer ${token}`);
};

export const requestUpdateShipmentStatus = async (token: string, shipmentId: string) => {
  return await request(app)
    .put(`/shipments-admin/${shipmentId}/status`)
    .set("Authorization", `Bearer ${token}`);
};

export async function getAdminToken(
  email = "admin@example.com",
  password = "YourSecurePassword123!"
): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 10);
  await UserModel.create({
    name: "Admin User",
    email,
    password: hashedPassword,
    role: "admin",
    loginAttempts: 0,
    accountLocked: false,
    emailVerified: true,
  });

  const loginResponse = await requestLogin(email, password);
  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.accessToken).toBeDefined();
  return loginResponse.body.accessToken;
}

const DEFAULT_SHIPMENT = {
  packageType: "box",
  itemDescription: "clothings",
  quantity: 4,
  weight: 5,
  height: 10,
  width: 10,
  length: 10,
  destination: "madinah",
  origin: "sydney",
  senderEmail: "sender@example.com",
  senderPhone: "+61412345678",
  recipientEmail: "recipient@example.com",
  recipientPhone: "+61412345679",
};

export async function createCustomerShipments(token: string, count: number): Promise<string[]> {
  const shipmentIds: string[] = [];

  for (let i = 0; i < count; i++) {
    const res = await requestNewShipment(
      token,
      DEFAULT_SHIPMENT.packageType,
      DEFAULT_SHIPMENT.itemDescription,
      DEFAULT_SHIPMENT.quantity,
      DEFAULT_SHIPMENT.weight,
      DEFAULT_SHIPMENT.height,
      DEFAULT_SHIPMENT.width,
      DEFAULT_SHIPMENT.length,
      DEFAULT_SHIPMENT.destination,
      DEFAULT_SHIPMENT.origin,
      DEFAULT_SHIPMENT.senderEmail,
      DEFAULT_SHIPMENT.senderPhone,
      DEFAULT_SHIPMENT.recipientEmail,
      DEFAULT_SHIPMENT.recipientPhone
    );
    expect(res.statusCode).toBe(200);
    shipmentIds.push(res.body.result);
  }

  return shipmentIds;
}

export async function advanceShipmentStatus(
  adminToken: string,
  shipmentId: string,
  steps: number
): Promise<void> {
  for (let i = 0; i < steps; i++) {
    const res = await requestUpdateShipmentStatus(adminToken, shipmentId);
    expect(res.statusCode).toBe(200);
  }
}
