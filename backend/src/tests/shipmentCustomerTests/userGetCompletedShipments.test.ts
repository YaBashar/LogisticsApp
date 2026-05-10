import {
  requestCompletedShipments,
  requestDelete,
  requestNewShipment,
  getToken,
} from "../requestHelpers";
import mongoose from "mongoose";

const MONGO_OPTIONS = { serverSelectionTimeoutMS: 5000 };
import { ShipmentModel } from "../../models/shipmentsModel";

let token: string;

beforeEach(async () => {
  await requestDelete();
  token = await getToken("Mubashir", "Hussain", "example@gmail.com", "Abcdefgh1234$");
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

describe("Error", () => {
  test("Invalid Token", async () => {
    await requestNewShipment(
      token,
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
    const res = await requestCompletedShipments("invalidToken", 1, 1);
    const data = res.body;

    expect(res.statusCode).toStrictEqual(401);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

describe("Success", () => {
  test("Success", async () => {
    const res1 = await requestNewShipment(
      token,
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
      token,
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

    // Get the shipment IDs from the responses
    const shipmentId1 = res1.body.result;
    console.log(shipmentId1);

    // Mark first shipment as completed
    await ShipmentModel.findByIdAndUpdate(shipmentId1, { completed: true });

    const res = await requestCompletedShipments(token, 1, 1);
    const data = res.body;

    expect(res.statusCode).toStrictEqual(200);
    expect(data).toStrictEqual({
      result: expect.arrayContaining([
        expect.objectContaining({
          itemDescription: "clothings",
          quantity: 4,
          weight: 5,
          destination: "madinah",
          origin: "sydney",
          packageType: "box",
          senderEmail: "mubashirmh04457@gmail.com",
          senderPhone: "+61412345678",
          recipientEmail: "mubashirmh04@gmail.com",
          recipientPhone: "+61412345679",
          completed: true,
          _id: expect.any(String),
          userId: expect.any(String),
          __v: expect.any(Number),
          orderNumber: expect.any(Number),
        }),
      ]),
    });
  });
});
