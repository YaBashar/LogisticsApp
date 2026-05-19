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
import { ShipmentModel, ShipmentStatus } from "../../models/shipmentsModel";
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
    const res = await requestUpdateShipmentStatus(adminToken, shipmentId);

    expect(res.statusCode).toStrictEqual(200);
  });
});

describe("Status progression", () => {
  const getShipment = () => ShipmentModel.findById(shipmentId);

  test("advances status through each step until shipment is completed", async () => {
    let shipment = await getShipment();
    expect(shipment?.status).toStrictEqual(ShipmentStatus.Pending);
    expect(shipment?.completed).not.toBe(true);
    expect(shipment?.datePicked).toBeUndefined();
    expect(shipment?.dateShipped).toBeUndefined();
    expect(shipment?.dateDelivered).toBeUndefined();
    expect(shipment?.dateRecieved).toBeUndefined();

    let res = await requestUpdateShipmentStatus(adminToken, shipmentId);
    expect(res.statusCode).toStrictEqual(200);
    expect(res.body).toStrictEqual({ result: { success: true } });

    shipment = await getShipment();
    expect(shipment?.status).toStrictEqual(ShipmentStatus.Picked);
    expect(shipment?.datePicked).toBeInstanceOf(Date);
    expect(shipment?.dateShipped).toBeUndefined();

    res = await requestUpdateShipmentStatus(adminToken, shipmentId);
    expect(res.statusCode).toStrictEqual(200);

    shipment = await getShipment();
    expect(shipment?.status).toStrictEqual(ShipmentStatus.Shipped);
    expect(shipment?.dateShipped).toBeInstanceOf(Date);
    expect(shipment?.dateDelivered).toBeUndefined();

    res = await requestUpdateShipmentStatus(adminToken, shipmentId);
    expect(res.statusCode).toStrictEqual(200);

    shipment = await getShipment();
    expect(shipment?.status).toStrictEqual(ShipmentStatus.Delivered);
    expect(shipment?.dateDelivered).toBeInstanceOf(Date);
    expect(shipment?.dateRecieved).toBeUndefined();
    expect(shipment?.completed).not.toBe(true);

    res = await requestUpdateShipmentStatus(adminToken, shipmentId);
    expect(res.statusCode).toStrictEqual(200);

    shipment = await getShipment();
    expect(shipment?.status).toStrictEqual(ShipmentStatus.Received);
    expect(shipment?.dateRecieved).toBeInstanceOf(Date);
    expect(shipment?.completed).toBe(true);

    res = await requestUpdateShipmentStatus(adminToken, shipmentId);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.body).toStrictEqual({ error: expect.any(String) });
  });
});

describe("Error", () => {
  test("Regular user cannot access admin route", async () => {
    const res = await requestUpdateShipmentStatus(customerToken, shipmentId);
    const data = res.body;

    expect(res.statusCode).toStrictEqual(403);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test("Shipment Id Doesnt Exist", async () => {
    const res = await requestUpdateShipmentStatus(adminToken, "507f1f77bcf86cd799439011");
    const data = res.body;

    expect(res.statusCode).toStrictEqual(400);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test("Invalid Status Type", async () => {
    await ShipmentModel.findByIdAndUpdate(
      shipmentId,
      { status: "Invalid" },
      { runValidators: false }
    );

    const res = await requestUpdateShipmentStatus(adminToken, shipmentId);
    const data = res.body;

    expect(res.statusCode).toStrictEqual(400);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});
