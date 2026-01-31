import {
  requestDelete,
  requestAuthRegister,
  requestResetPassword,
  requestVerifyResetCode,
  resetPassword,
} from "../requestHelpers";
import { UserModel } from "../../models/userModel";
import mongoose from "mongoose";

let resetCode: string;

beforeEach(async () => {
  await requestDelete();

  await requestAuthRegister(
    "Mubashir",
    "Hussain",
    "Abcdefgh123456$",
    "example@gmail.com"
  );
  await requestResetPassword("example@gmail.com");

  // Get the reset code directly from DB
  const user = await UserModel.findOne({ email: "example@gmail.com" });
  resetCode = user?.resetCode;

  const res = await requestVerifyResetCode(resetCode);
  const data = res.body;
  expect(res.statusCode).toStrictEqual(200);
  expect(data.result).toStrictEqual({ success: true });
});

afterEach(async () => {
  await requestDelete();
});

beforeAll(async () => {
  // Ensure DB is connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Success", () => {
  test("Password is reset", async () => {
    const res1 = await resetPassword(resetCode, "NewerPassword1234*");
    const data1 = res1.body;

    expect(res1.statusCode).toStrictEqual(200);
    expect(data1.result).toStrictEqual({ success: true });
  });
});

describe("Error", () => {
  test("Using Same Password", async () => {
    const res1 = await resetPassword(resetCode, "Abcdefgh123456$");
    const data1 = res1.body;

    expect(res1.statusCode).toStrictEqual(400);
    expect(data1).toStrictEqual({ error: expect.any(String) });
  });
});
