import { requestAuthRegister, requestAuthLogin, requestRefreshToken, requestDelete } from '../requestHelpers';
import mongoose from 'mongoose';

beforeEach(async () => {
  await requestDelete();
});

afterEach(async () => {
  await requestDelete();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Success Cases', () => {
  test('Success', async () => {
    await requestAuthRegister('Mubashir', 'Hussain', 'Abcdefg123$', 'example@gmail.com');
    const res1 = await requestAuthLogin('example@gmail.com', 'Abcdefg123$');
    const cookie = res1.headers['set-cookie'];

    const res2 = await requestRefreshToken(cookie);
    const data = res2.body;
    expect(data).toStrictEqual({ token: expect.any(String) });
    expect(res2.statusCode).toStrictEqual(200);
  });
});

describe('Error Cases', () => {
  test('Invalid Token', async () => {
    const invalidCookie = 'jwt=wrongRefreshToken';
    const res = await requestRefreshToken(invalidCookie);
    const data = res.body;
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
});
