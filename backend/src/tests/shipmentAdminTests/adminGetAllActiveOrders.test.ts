import {
  requestAllActiveShipments,
  requestAuthLogin,
  requestAuthRegister,
  requestDelete,
  requestNewShipment,
} from "../requestHelpers";
import mongoose from "mongoose";
import { UserModel } from "../../models/userModel";
import bcrypt from "bcrypt";

let customerToken: string;
let adminToken: string;

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

describe("Error", () => {
  test("Invalid Token", async () => {
    const res = await requestAllActiveShipments("invalidToken", 1, 1);
    const data = res.body;

    expect(res.statusCode).toStrictEqual(401);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

describe("Success", () => {
  test("Success", async () => {
    const res = await requestAllActiveShipments(adminToken, 1, 1);
    const data = res.body;

    expect(res.statusCode).toStrictEqual(200);
    expect(data).toStrictEqual({
      result: expect.arrayContaining([
        expect.objectContaining({
          itemDescription: "clothings",
          quantity: 4,
          weight: 5,
          height: expect.any(Number),
          length: expect.any(Number),
          width: expect.any(Number),
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
          height: expect.any(Number),
          length: expect.any(Number),
          width: expect.any(Number), 
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
      ]),
    });
  });
});
