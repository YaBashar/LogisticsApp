import { requestDelete, requestAuthRegister, requestResetPassword, requestVerifyResetCode } from '../requestHelpers';
import { UserModel } from '../../models/userModel';
import mongoose from 'mongoose';

beforeEach(async () => {
  await requestDelete();
});

afterEach(async () => {
  await requestDelete();
});

beforeAll(async () => {
  // Ensure DB is connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
})

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Success', () => {

    test('verifyEmail marks user as verified', async () => {
        await requestAuthRegister('Mubashir', 'Hussain', 'Abcdefgh123456$', 'example@gmail.com');

        await requestResetPassword('example@gmail.com');
        // Get the reset code directly from DB
        const user = await UserModel.findOne({ email: 'example@gmail.com' });
        const response = await requestVerifyResetCode(user.resetCode);
        expect(response.statusCode).toBe(200);
        
    });
})

describe('Error', () => {
    test('Invalid Reset Code', async () => {
        await requestAuthRegister('Mubashir', 'Hussain', 'Abcdefgh123456$', 'example@gmail.com');
        const res = await requestVerifyResetCode('123456');
        expect(res.statusCode).toStrictEqual(400);

    })
})