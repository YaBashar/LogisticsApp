import {
  requestAuthLogin,
  requestAuthLogout,
  requestAuthRegister,
  requestDelete,
} from "../requestHelpers";
import mongoose from "mongoose";

let token: string;

beforeEach(async () => {
  await requestDelete();
  await requestAuthRegister("Mubashir", "Hussain", "Abcdefgh1234$", "example@gmail.com");
  const res = await requestAuthLogin("example@gmail.com", "Abcdefgh1234$");
  const { accessToken } = res.body;
  token = accessToken;
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

describe("Error Cases", () => {
  test("Invalid Token", async () => {
    const res = await requestAuthLogout("invalidToken");
    const data = res.body;
    expect(res.statusCode).toStrictEqual(401);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test("User Already Logged out", async () => {
    await requestAuthLogout(token);
    const res = await requestAuthLogout(token);
    const data = res.body;
    expect(res.statusCode).toStrictEqual(400);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

describe("Success Cases", () => {
  test("Logged Out Successfully", async () => {
    const res = await requestAuthLogout(token);
    const data = res.body;
    expect(data).toStrictEqual({ message: "Logged out successfully" });
    expect(res.statusCode).toStrictEqual(200);
  });
});
