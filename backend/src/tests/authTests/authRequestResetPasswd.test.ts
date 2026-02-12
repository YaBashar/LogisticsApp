import { requestDelete, requestAuthRegister, requestResetPassword } from "../requestHelpers";
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
    await requestAuthRegister("Mubashir", "Hussain", "Abcdefgh1234$", "example@gmail.com");
    const res = await requestResetPassword("example@gmail.com");
    expect(res.statusCode).toStrictEqual(200);
    expect(res.body.result).toStrictEqual({ success: true });
  });
});

describe("Error", () => {
  test("Invalid Email", async () => {
    await requestAuthRegister("Mubashir", "Hussain", "Abcdefgh1234$", "example@gmail.com");
    const res = await requestResetPassword("invalid@gmail.com");

    expect(res.statusCode).toStrictEqual(400);
    expect(res.body).toStrictEqual({ error: expect.any(String) });
  });
});
