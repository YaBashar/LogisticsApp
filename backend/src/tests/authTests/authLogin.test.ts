import { requestAuthLogin, requestAuthRegister, requestAuthUserDetails, requestDelete } from '../requestHelpers';
import mongoose from 'mongoose';

beforeEach(async () => {
  await requestDelete();
  await requestAuthRegister('Mubashir', 'Hussain', 'Abcdefg123$', 'example@gmail.com');
});

afterEach(async () => {
  await requestDelete();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Error Cases', () => {
  test('Email address does not exist', async () => {
    const res = await requestAuthLogin('zid2@unsw.edu.au', 'Abcdefg123$');
    const data = res.body;

    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('Incorrect password', async () => {
    const res = await requestAuthLogin('example@gmail.com', 'abcd123');
    const data = res.body

    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
});

describe('Success Cases', () => {
  test('Logged In Successfully', async () => {
    const res = await requestAuthLogin('example@gmail.com', 'Abcdefg123$');
    const data = res.body
    expect(data).toStrictEqual({ token: expect.any(String) });
    expect(res.statusCode).toStrictEqual(200);
  });

  test('Correct User LoggedIn', async () => {
    const res = await requestAuthLogin('example@gmail.com', 'Abcdefg123$');
    const data = res.body
    const token = data.token;

    const res1 = await requestAuthUserDetails(token);
    const data1 = res1.body;

    expect(data1).toStrictEqual({
      user: {
        userId: expect.any(String),
        name: 'Mubashir Hussain',
        email: 'example@gmail.com',
        role: 'customer'
      }
    });
  });
});

