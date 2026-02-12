import {
  requestDelete,
  requestAuthRegister,
  requestAuthLogin,
  requestChangePassword,
} from "../requestHelpers";
import mongoose from "mongoose";

let token: string;

beforeEach(async () => {
  await requestDelete();

  await requestAuthRegister("Mubashir", "Hussain", "Abcdefgh1234$", "example@gmail.com");
  const res = await requestAuthLogin("example@gmail.com", "Abcdefgh1234$");
  const data = res.body;
  token = data.accessToken;
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
  test("Password is changed", async () => {
    const res1 = await requestChangePassword(token, "Abcdefgh1234$", "NewerPassword1234*");
    const data1 = res1.body;

    expect(res1.statusCode).toStrictEqual(200);
    expect(data1.result).toStrictEqual({ success: true });
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
