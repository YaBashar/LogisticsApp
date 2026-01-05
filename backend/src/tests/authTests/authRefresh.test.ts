import { requestAuthRegister, requestAuthLogin, requestRefreshToken, requestDelete } from '../requestHelpers';

beforeEach(() => {
  requestDelete();
});

afterEach(() => {
  requestDelete();
});

describe('Success Cases', () => {
  test('Success', async () => {
    await requestAuthRegister('Mubashir', 'Hussain', 'Abcdefg123$', 'example@gmail.com');
    const res1 = await requestAuthLogin('example@gmail.com', 'Abcdefg123$');
    const cookie = res1.headers['set-cookie'];

    const res2 = await requestRefreshToken(cookie);
    const data = JSON.parse(res2.body.toString());
    expect(data).toStrictEqual({ token: expect.any(String) });
    expect(res2.statusCode).toStrictEqual(200);
  });
});

describe('Error Cases', () => {
  test('Invalid Token', async () => {
    const invalidCookie = 'jwt=wrongRefreshToken';
    const res = await requestRefreshToken(invalidCookie);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
});
