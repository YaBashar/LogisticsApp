import mongoose from "mongoose";
import { ShipmentStatus } from "../../models/shipmentsModel";
import {
  requestDelete,
  getToken,
  getAdminToken,
  createCustomerShipments,
  advanceShipmentStatus,
  requestProfile,
} from "../requestHelpers";

const MONGO_OPTIONS = { serverSelectionTimeoutMS: 5000 };

const CUSTOMER = {
  firstName: "Mubashir",
  lastName: "Hussain",
  email: "example@gmail.com",
  password: "Abcdefgh1234$",
  name: "Mubashir Hussain",
};

/** Status advances per shipment: 0 stays Pending, 4 reaches Received, etc. */
const STATUS_ADVANCE_STEPS = [0, 1, 2, 3, 4, 4, 2];

const EXPECTED_SHIPMENT_COUNTS = {
  [ShipmentStatus.Pending]: 1,
  [ShipmentStatus.Picked]: 1,
  [ShipmentStatus.Shipped]: 2,
  [ShipmentStatus.Delivered]: 1,
  [ShipmentStatus.Received]: 2,
};

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

afterEach(async () => {
  await requestDelete();
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
}, 10000);

describe("GET /auth/profile", () => {
  test("returns user profile with shipment counts after varied admin status updates", async () => {
    await requestDelete();

    const customerToken = await getToken(
      CUSTOMER.firstName,
      CUSTOMER.lastName,
      CUSTOMER.email,
      CUSTOMER.password
    );

    const shipmentIds = await createCustomerShipments(
      customerToken,
      STATUS_ADVANCE_STEPS.length
    );

    const adminToken = await getAdminToken();

    for (let i = 0; i < shipmentIds.length; i++) {
      await advanceShipmentStatus(adminToken, shipmentIds[i], STATUS_ADVANCE_STEPS[i]);
    }

    const res = await requestProfile(customerToken);

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual({
      name: CUSTOMER.name,
      email: CUSTOMER.email,
      role: "customer",
      shipmentCounts: EXPECTED_SHIPMENT_COUNTS,
    });
  });
});
