import dotenv from 'dotenv';
import { requestAllActiveShipments, requestAuthLogin, requestAuthRegister, requestDelete, requestNewShipment } from '../requestHelpers';
import mongoose from 'mongoose';
import { UserModel } from '../../models/userModel';
import bcrypt from 'bcrypt';
import { error } from 'node:console';

let customerToken: string;
let adminToken: string;

beforeEach(async () => {
  await requestDelete();
  await requestAuthRegister('Mubashir', 'Hussain', 'Abcdefgh1234$', 'example@gmail.com');
  const res = await requestAuthLogin('example@gmail.com', 'Abcdefgh1234$');
  customerToken = res.body.token;

  await requestNewShipment(customerToken, 'clothing', 4,  'madinah', 'sydney')
  await requestNewShipment(customerToken, 'moreclothing', 4, 'madinah', 'sydney')


  // Create admin user directly in database
  const hashedPassword = await bcrypt.hash('YourSecurePassword123!', 10);
  await UserModel.create({
    name: 'Admin User',
    email: 'mubashirmh04@gmail.com',
    password: hashedPassword,
    refreshTokens: [],
    role: 'admin',
    loginAttempts: 0,
    accountLocked: false,
    emailVerified: true
  });


  const res2 = await requestAuthLogin('mubashirmh04@gmail.com', 'YourSecurePassword123!')
  adminToken = res2.body.token;
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
})

describe('Error', () => {
    test('Invalid Token', async () => {
        const res = await requestAllActiveShipments('invalidToken');
        const data = res.body;

        expect(res.statusCode).toStrictEqual(401);
        expect(data).toStrictEqual({error: expect.any(String)})
    })
})

describe('Success', () => {
    test('Success', async () => {
        const res = await requestAllActiveShipments(adminToken);
        const data = res.body;

        expect(res.statusCode).toStrictEqual(200);
        expect(data).toStrictEqual({ 
          result: expect.arrayContaining([
            expect.objectContaining({
              itemDescription: 'clothing',
              quantity: 4,
              destination: 'madinah',
              origin: 'sydney',
              completed: false,
              _id: expect.any(String),
              __v: expect.any(Number),
              orderNumber: expect.any(Number),
              userId: expect.objectContaining({ 
                _id: expect.any(String),
                name: 'Mubashir Hussain'
              }),
            }),
            expect.objectContaining({
              itemDescription: 'moreclothing',
              quantity: 4,
              destination: 'madinah',
              origin: 'sydney',
              completed: false,
              _id: expect.any(String),
              __v: expect.any(Number),
              orderNumber: expect.any(Number),
              userId: expect.objectContaining({ 
                _id: expect.any(String),
                name: 'Mubashir Hussain'
              }),
            })
          ])
        });
    })
})