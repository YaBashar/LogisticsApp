import {
  requestDelete,
  requestNewShipment,
  getToken,
} from "../requestHelpers";
import mongoose from "mongoose";

const MONGO_OPTIONS = { serverSelectionTimeoutMS: 5000 };

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
  // Item Description
  test("Item Description Empty Empty", async () => {
    const res = await requestNewShipment(
      token,
      "box",
      "",
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
    const data = res.body;

    expect(res.statusCode).toStrictEqual(400);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  // Quantity
  test("Quantity has to be > 0", async () => {
    const res = await requestNewShipment(
      token,
      "box",
      "clothings",
      0,
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
    const data = res.body;

    expect(res.statusCode).toStrictEqual(400);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test("Quantity must be a whole number", async () => {
    const res = await requestNewShipment(
      token,
      "box",
      "clothings",
      4.3,
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
    const data = res.body;

    expect(res.statusCode).toStrictEqual(400);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test("Quantity cannot exceed 1 000 000", async () => {
    const res = await requestNewShipment(
      token,
      "box",
      "clothings",
      10000000,
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
    const data = res.body;

    expect(res.statusCode).toStrictEqual(400);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  // Origin + Destination
  test("Origin and Destination cannot be the same", async () => {
    const res = await requestNewShipment(
      token,
      "box",
      "clothings",
      4,
      5,
      10,
      10,
      10,
      "madinah",
      "madinah",
      "mubashirmh04457@gmail.com",
      "+61412345678",
      "mubashirmh04@gmail.com",
      "+61412345679"
    );
    const data = res.body;

    expect(res.statusCode).toStrictEqual(400);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test("Invalid Token", async () => {
    const res = await requestNewShipment(
      "invalidToken",
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
    const data = res.body;

    expect(res.statusCode).toStrictEqual(401);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

describe("Success", () => {
  test("Success", async () => {
    const res = await requestNewShipment(
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
    const data = res.body;
    console.log(data);

    expect(res.statusCode).toStrictEqual(200);
    expect(data).toStrictEqual({ result: expect.any(String) });
  });
});
