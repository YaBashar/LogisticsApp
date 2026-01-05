import { requestDelete, requestAuthRegister, requestAuthLogin, requestAuthUserDetails } from '../requestHelpers';
import mongoose from 'mongoose';

beforeEach( async () => {
  await requestDelete();
});

afterEach(async() => {
  await requestDelete();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Error Cases', () => {
  describe('Test Email', () => {
    test('email address is already used by another user', async () => {
      await requestAuthRegister('email@unsw.edu.au', 'abcd1234', 'first', 'last');
      const res = await requestAuthRegister('email@unsw.edu.au', 'abcd1234', 'first', 'last');
      const data = res.body;

      expect(data).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });

    // email address does not satisfy isEmail
    test.each([
      'invalidunsw.edu.au', 'invalidemailslkcom',
      'invalid@emailcom', 'yrigushfsgpishfd',
      '34678893487', '#$%^&*()&*()',

    ])('invalid email address', async (email) => {
      const res = await requestAuthRegister(email, 'abcd1234', 'first', 'last');
      const data = res.body;

      expect(data).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });
  });

  describe('Test Name', () => {
    test.each([
      '~', '`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
      '_', '+', '=', '{', '[', '}', ']', '|', '\\', ':', ';', '"', '<', ',',
      '>', '.', '?', '/', '1',
    ])('first name containing invalid charcters', async (char) => {
      const res = await requestAuthRegister('email@unsw.edu.au', 'abcd1234', 'first' + char, 'last');
      const data = res.body;

      expect(data).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });

    // FirstName is less than 2 characters or more than 20 characters.
    test.each([
      'a', ' ', 'abcdefghijklmnopqrstu',
      'abcdefghijk-lmnopqrstuvwxyz',
    ])('first name is an invalid length', async (first) => {
      const res = await requestAuthRegister('email@unsw.edu.au', 'abcd1234', first, 'last');
      const data = res.body;

      expect(data).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });

    // LastName contains characters other than lowercase
    // letters, uppercase letters, spaces, hyphens, or apostrophes.
    test.each([
      '~', '`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
      '_', '+', '=', '{', '[', '}', ']', '|', '\\', ':', ';', '"', '<', ',',
      '>', '.', '?', '/', '1',
    ])('last name containing invalid charcters', async (char) => {
      const res = await requestAuthRegister('email@unsw.edu.au', 'abcd1234', 'first', 'last' + char);
      const data = res.body;

      expect(data).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });

    // NameLast is less than 2 characters or more than 20 characters.
    test.each([
      'a', ' ', 'abcdefghijklmnopqrstu',
      'abcdefghijk-lmnopqrstuvwxyz',
    ])('last name is an invalid length', async (last) => {
      const res = await requestAuthRegister('email@unsw.edu.au', 'abcd1234', 'first', last);
      const data = res.body;

      expect(data).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });

    describe('Testing password', () => {
      // Password is less than 8 characters.
      test('Invalid password length', async () => {
        const res = await requestAuthRegister('email@unsw.edu.au', 'abc123', 'first', 'last');
        const data = res.body;

        expect(data).toStrictEqual({ error: expect.any(String) });
        expect(res.statusCode).toStrictEqual(400);
      });

      // Password does not contain at least one number and at least one letter.
      test.each([
        'abcdefgh', '12345678', 'shfvfhj^&&*%', '253768%&^*',
      ])('Password does not contain at least one number and one letter', async (password) => {
        const res = await requestAuthRegister('email@unsw.edu.au', password, 'first', 'last');
        const data = res.body;

        expect(data).toStrictEqual({ error: expect.any(String) });
        expect(res.statusCode).toStrictEqual(400);
      });
    });
  });
});

describe('Success Cases', () => {
  test('Register User', async () => {
    const result = await requestAuthRegister('Mubashir', 'Hussain', 'SecurePassword123*', 'Mubashirmh04@gmail.com');
    const data = result.body;

    expect(data.userId).toStrictEqual(expect.any(String));
    expect(result.statusCode).toStrictEqual(200);
  });

  test('Correct User Registered', async () => {
    const res1 = await requestAuthRegister('Mubashir', 'Hussain', 'SecurePassword123*', 'Mubashirmh04@gmail.com');
    const data1 = res1.body;
    const userId = data1.userId;

    const res2 = await requestAuthLogin('Mubashirmh04@gmail.com', 'SecurePassword123*');
    const data2 = res2.body;
    const token = data2.token;

    const res3 = await requestAuthUserDetails(token);
    const data3 = res3.body;
    expect(data3).toStrictEqual({
      user: {
        userId: userId,
        name: 'Mubashir Hussain',
        email: 'Mubashirmh04@gmail.com',
        role: 'customer'
      }
    });
  });
});
