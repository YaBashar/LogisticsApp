import {
  requestDelete,
  requestAuthRegister,
  requestAuthLogin,
  requestAuthUserDetails,
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

describe("Error Case", () => {
  test("Invalid Token", async () => {
    await requestAuthRegister("Mubashir", "Hussain", "Abcdefgh1234$", "example@gmail.com");
    await requestAuthLogin("example@gmail.com", "Abcdefgh1234$");

    const res1 = await requestAuthUserDetails("Invalid Token");
    const data1 = res1.body;
    expect(data1).toStrictEqual({ error: expect.any(String) });
    expect(res1.statusCode).toStrictEqual(401);
  });
});

describe("Success Case", () => {
  test("Success", async () => {
    await requestAuthRegister("Mubashir", "Hussain", "Abcdefgh1234$", "example@gmail.com");
    const res = await requestAuthLogin("example@gmail.com", "Abcdefgh1234$");
    const data = res.body;
    const token = data.token;

    const res1 = await requestAuthUserDetails(token);
    const data1 = res1.body;
    expect(data1).toStrictEqual({
      user: {
        userId: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        role: "customer",
      },
    });

    expect(res1.statusCode).toStrictEqual(200);
  });
});
