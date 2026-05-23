import {
  requestAllActiveShipments,
  requestLogin,
  requestDelete,
  requestNewShipment,
  getToken,
} from "../requestHelpers";
import mongoose from "mongoose";

const MONGO_OPTIONS = { serverSelectionTimeoutMS: 5000 };
import { UserModel } from "../../models/userModel";
import bcrypt from "bcrypt";

let customerToken: string;
let adminToken: string;

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
  await requestNewShipment(
    customerToken,
    "crate",
    "appliances",
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
  if (!process.env.MONGODB_URI_TEST) {
    throw new Error(
      "MONGODB_URI_TEST is not set. Copy backend/.env.example to backend/.env and set MONGODB_URI_TEST."
    );
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI_TEST, MONGO_OPTIONS);
  }
}, 10000);

describe("Error", () => {
  test("Invalid Token", async () => {
    const res = await requestAllActiveShipments("invalidToken", 1, 1);
    const data = res.body;

    expect(res.statusCode).toStrictEqual(401);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test("Regular user cannot access admin route", async () => {
    const res = await requestAllActiveShipments(customerToken, 1, 1);
    const data = res.body;

    expect(res.statusCode).toStrictEqual(403);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

describe("Success", () => {
  test("Success", async () => {
    const res = await requestAllActiveShipments(adminToken, 1, 2);
    const data = res.body;

    expect(res.statusCode).toStrictEqual(200);
    expect(data.result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          itemDescription: "clothings",
          quantity: 4,
          weight: 5,
          height: 10,
          length: 10,
          width: 10,
          destination: "madinah",
          origin: "sydney",
          packageType: "box",
          senderEmail: "mubashirmh04457@gmail.com",
          senderPhone: "+61412345678",
          recipientEmail: "mubashirmh04@gmail.com",
          recipientPhone: "+61412345679",
          completed: false,
          _id: expect.any(String),
          userId: expect.objectContaining({
            _id: expect.any(String),
            name: "Mubashir Hussain",
          }),
          __v: expect.any(Number),
          orderNumber: expect.any(Number),
        }),
        expect.objectContaining({
          itemDescription: "appliances",
          quantity: 4,
          weight: 5,
          height: 10,
          length: 10,
          width: 10,
          destination: "madinah",
          origin: "sydney",
          packageType: "crate",
          senderEmail: "mubashirmh04457@gmail.com",
          senderPhone: "+61412345678",
          recipientEmail: "mubashirmh04@gmail.com",
          recipientPhone: "+61412345679",
          completed: false,
          _id: expect.any(String),
          userId: expect.objectContaining({
            _id: expect.any(String),
            name: "Mubashir Hussain",
          }),
          __v: expect.any(Number),
          orderNumber: expect.any(Number),
        }),
      ])
    );
  });
});
