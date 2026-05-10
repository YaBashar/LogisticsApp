import {
  requestAllActiveShipments,
  requestLogin,
  requestDelete,
  requestNewShipment,
  requestUpdateShipmentStatus,
  getToken,
} from "../requestHelpers";
import mongoose from "mongoose";

const MONGO_OPTIONS = { serverSelectionTimeoutMS: 5000 };
import { UserModel } from "../../models/userModel";
import bcrypt from "bcrypt";

let customerToken: string;
let adminToken: string;
let shipmentId: string;

beforeEach(async () => {
  await requestDelete();
  customerToken = await getToken("Mubashir", "Hussain", "example@gmail.com", "Abcdefgh1234$");

  await requestNewShipment(
    customerToken,
    "box",
    "clothings",
    4,
    5,
    10,
    10,
    10,
    "madinah",
    "sydney",
    "mubashirmh04457@gmail.com",
    "+61412345678",
    "mubashirmh04@gmail.com",
    "+61412345679"
  );

  // Create admin user directly in database
  const hashedPassword = await bcrypt.hash("YourSecurePassword123!", 10);
  await UserModel.create({
    name: "Admin User",
    email: "mubashirmh04@gmail.com",
    password: hashedPassword,
    role: "admin",
    loginAttempts: 0,
    accountLocked: false,
    emailVerified: true,
  });

  const res2 = await requestLogin("mubashirmh04@gmail.com", "YourSecurePassword123!");
  adminToken = res2.body.accessToken;

  const res3 = await requestAllActiveShipments(adminToken, 1, 1);
  shipmentId = res3.body.result[0]._id;
});

afterEach(async () => {
  await requestDelete();
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
}, 10000);

beforeAll(async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Copy backend/.env.example to backend/.env and set MONGODB_URI."
    );
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, MONGO_OPTIONS);
  }
}, 10000);

describe("Success", () => {
  test("Success", async () => {
    const res = await requestUpdateShipmentStatus(adminToken, shipmentId, "Picked");
    // const data = res.body;

    expect(res.statusCode).toStrictEqual(200);
  });
});

describe("Error", () => {
  test("Regular user cannot access admin route", async () => {
    const res = await requestUpdateShipmentStatus(customerToken, shipmentId, "Picked");
    const data = res.body;

    expect(res.statusCode).toStrictEqual(403);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test("Shipment Id Doesnt Exist", async () => {
    const res = await requestUpdateShipmentStatus(adminToken, "507f1f77bcf86cd799439011", "Picked");
    const data = res.body;

    expect(res.statusCode).toStrictEqual(400);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test("Invalid Status Type", async () => {
    const res = await requestUpdateShipmentStatus(adminToken, shipmentId, "Invalid");
    const data = res.body;

    expect(res.statusCode).toStrictEqual(400);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});
