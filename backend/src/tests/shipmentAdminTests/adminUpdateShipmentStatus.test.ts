import {
  requestAllActiveShipments,
  requestAuthLogin,
  requestAuthRegister,
  requestDelete,
  requestNewShipment,
  requestUpdateShipmentStatus,
} from "../requestHelpers";
import mongoose from "mongoose";
import { UserModel } from "../../models/userModel";
import bcrypt from "bcrypt";

let customerToken: string;
let adminToken: string;
let shipmentId: string;

beforeEach(async () => {
  await requestDelete();
  await requestAuthRegister(
    "Mubashir",
    "Hussain",
    "Abcdefgh1234$",
    "example@gmail.com"
  );
  const res = await requestAuthLogin("example@gmail.com", "Abcdefgh1234$");
  customerToken = res.body.token;

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
    refreshTokens: [],
    role: "admin",
    loginAttempts: 0,
    accountLocked: false,
    emailVerified: true,
  });

  const res2 = await requestAuthLogin(
    "mubashirmh04@gmail.com",
    "YourSecurePassword123!"
  );
  adminToken = res2.body.token;

  const res3 = await requestAllActiveShipments(adminToken, 1, 1);
  shipmentId = res3.body.result[0]._id;
});

afterEach(async () => {
  await requestDelete();
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeAll(async () => {
  // Ensure DB is connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
});

describe("Success", () => {
  test("Success", async () => {
    const res = await requestUpdateShipmentStatus(
      adminToken,
      shipmentId,
      "Picked"
    );
    // const data = res.body;

    expect(res.statusCode).toStrictEqual(200);
  });
});

describe("Error", () => {
  test("Shipment Id Doesnt Exist", async () => {
    const res = await requestUpdateShipmentStatus(
      adminToken,
      "507f1f77bcf86cd799439011",
      "Picked"
    );
    const data = res.body;

    expect(res.statusCode).toStrictEqual(400);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test("Invalid Status Type", async () => {
    const res = await requestUpdateShipmentStatus(
      adminToken,
      shipmentId,
      "Invalid"
    );
    const data = res.body;

    expect(res.statusCode).toStrictEqual(400);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});
