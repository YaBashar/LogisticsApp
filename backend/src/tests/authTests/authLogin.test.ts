import { requestAuthLogin, requestAuthRegister, requestAuthUserDetails, requestDelete } from '../requestHelpers';

beforeEach(async () => {
  requestDelete();
  requestAuthRegister('Mubashir', 'Hussain', 'Abcdefg123$', 'example@gmail.com');
});

afterEach(async () => {
  requestDelete();
});

describe('Error Cases', () => {
  test('Email address does not exist', async () => {
    const res = await requestAuthLogin('zid2@unsw.edu.au', 'Abcdefg123$');
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('Incorrect password', async () => {
    const res = await requestAuthLogin('example@gmail.com', 'abcd123');
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
});

describe('Success Cases', () => {
  test('Logged In Successfully', async () => {
    const res = await requestAuthLogin('example@gmail.com', 'Abcdefg123$');
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ token: expect.any(String) });
    expect(res.statusCode).toStrictEqual(200);
  });

  test('Correct User LoggedIn', async () => {
    const res = await requestAuthLogin('example@gmail.com', 'Abcdefg123$');
    const data = JSON.parse(res.body.toString());
    const token = data.token;

    const res1 = await requestAuthUserDetails(token);
    const data1 = JSON.parse(res1.body.toString());

    expect(data1).toStrictEqual({
      user: {
        userId: expect.any(String),
        name: 'Mubashir Hussain',
        email: 'example@gmail.com',
      }
    });
  });
});

