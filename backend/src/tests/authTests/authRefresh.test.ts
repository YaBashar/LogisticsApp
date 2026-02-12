import {
  requestAuthRegister,
  requestAuthLogin,
  requestRefreshToken,
  requestDelete,
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

describe("Success Cases", () => {
  test("Success", async () => {
    await requestAuthRegister("Mubashir", "Hussain", "Abcdefgh1234$", "example@gmail.com");
    const res1 = await requestAuthLogin("example@gmail.com", "Abcdefgh1234$");
    const cookie = res1.headers["set-cookie"];

    const res2 = await requestRefreshToken(cookie);
    const data = res2.body;
    expect(data).toStrictEqual({ accessToken: expect.any(String) });
    expect(res2.statusCode).toStrictEqual(200);
  });
});

describe("Error Cases", () => {
  test("Invalid Token", async () => {
    const invalidCookie = "refreshToken=wrongRefreshToken";
    const res = await requestRefreshToken(invalidCookie);
    const data = res.body;
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
});
