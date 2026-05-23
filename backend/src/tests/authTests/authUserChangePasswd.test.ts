import {
  requestDelete,
  requestChangePassword,
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

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
}, 10000);

describe("Success", () => {
  test("Password is changed", async () => {
    const res1 = await requestChangePassword(token, "Abcdefgh1234$", "NewerPassword1234*");
    const data1 = res1.body;

    expect(res1.statusCode).toStrictEqual(200);
    expect(data1).toStrictEqual({ success: true });
  });
});

describe("Error", () => {
  test("Current Password Invalid", async () => {
    const res1 = await requestChangePassword(token, "Abcdefsgh123456$", "NewerPassword1234*");
    const data1 = res1.body;

    expect(res1.statusCode).toStrictEqual(400);
    expect(data1).toStrictEqual({ error: expect.any(String) });
  });

  test("New Password is the same", async () => {
    const res1 = await requestChangePassword(token, "Abcdefgh123456$", "Abcdefgh123456$");
    const data1 = res1.body;

    expect(res1.statusCode).toStrictEqual(400);
    expect(data1).toStrictEqual({ error: expect.any(String) });
  });
});
