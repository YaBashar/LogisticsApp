import {
  requestDelete,
  requestAuthRegister,
  requestResetPassword,
  requestResendResetCode,
} from "../requestHelpers";
import mongoose from "mongoose";

beforeEach(async () => {
  await requestDelete();
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
  test("Sent Successfully", async () => {
    await requestAuthRegister("Mubashir", "Hussain", "Abcdefgh123456$", "example@gmail.com");

    const res = await requestResetPassword("example@gmail.com");
    const data = res.body;

    expect(res.statusCode).toStrictEqual(200);
    expect(data.result).toStrictEqual({ success: true });
  });
});

describe("Error", () => {
  test("Invalid Email", async () => {
    await requestAuthRegister("Mubashir", "Hussain", "Abcdefgh123456$", "example@gmail.com");
    const res = await requestResendResetCode("invalid@gmail.com");
    const data = res.body;

    expect(res.statusCode).toStrictEqual(400);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});
