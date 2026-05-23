import {
  requestAllActiveShipments,
  requestDelete,
  requestNewShipment,
  getToken,
  getAdminToken,
} from "../requestHelpers";
import mongoose from "mongoose";

jest.setTimeout(30000);

const MONGO_OPTIONS = { serverSelectionTimeoutMS: 8000 };

let customerToken: string;
let adminToken: string;

function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}@example.com`;
}

const SHIPMENT_CONTACT = {
  senderEmail: "sender@example.com",
  senderPhone: "+61412345678",
  recipientEmail: "recipient@example.com",
  recipientPhone: "+61412345679",
};

beforeEach(async () => {
  await requestDelete();

  const customerEmail = uniqueEmail("customer");
  const adminEmail = uniqueEmail("admin");

  customerToken = await getToken("Mubashir", "Hussain", customerEmail, "Abcdefgh1234$");
  adminToken = await getAdminToken(adminEmail, "YourSecurePassword123!");

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
    SHIPMENT_CONTACT.senderEmail,
    SHIPMENT_CONTACT.senderPhone,
    SHIPMENT_CONTACT.recipientEmail,
    SHIPMENT_CONTACT.recipientPhone
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
    SHIPMENT_CONTACT.senderEmail,
    SHIPMENT_CONTACT.senderPhone,
    SHIPMENT_CONTACT.recipientEmail,
    SHIPMENT_CONTACT.recipientPhone
  );
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
          senderEmail: SHIPMENT_CONTACT.senderEmail,
          senderPhone: SHIPMENT_CONTACT.senderPhone,
          recipientEmail: SHIPMENT_CONTACT.recipientEmail,
          recipientPhone: SHIPMENT_CONTACT.recipientPhone,
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
          senderEmail: SHIPMENT_CONTACT.senderEmail,
          senderPhone: SHIPMENT_CONTACT.senderPhone,
          recipientEmail: SHIPMENT_CONTACT.recipientEmail,
          recipientPhone: SHIPMENT_CONTACT.recipientPhone,
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
