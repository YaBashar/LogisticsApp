import dotenv from 'dotenv';
import { requestActiveShipments, requestAuthLogin, requestAuthRegister, requestDelete, requestNewShipment } from '../requestHelpers';
import mongoose from 'mongoose';

let token: string;

beforeEach(async () => {
  await requestDelete();
  await requestAuthRegister('Mubashir', 'Hussain', 'Abcdefgh1234$', 'example@gmail.com');
  const res = await requestAuthLogin('example@gmail.com', 'Abcdefgh1234$');
  token = res.body.token;
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
      await requestNewShipment(token, 'box', 'clothings', 4, 5, 10, 10, 10, 'madinah', 'sydney', 'mubashirmh04457@gmail.com', '+61412345678', 'mubashirmh04@gmail.com', '+61412345679')
      await requestNewShipment(token, 'crate', 'appliances', 4, 5, 10, 10, 10, 'madinah', 'sydney', 'mubashirmh04457@gmail.com', '+61412345678', 'mubashirmh04@gmail.com', '+61412345679')
         
      const res = await requestActiveShipments('invalidToken', 1, 1);
      const data = res.body;

      expect(res.statusCode).toStrictEqual(401);
      expect(data).toStrictEqual({error: expect.any(String)});
  })
})


describe('Success', () => {

    test('Success', async () => {
      await requestNewShipment(token, 'box', 'clothings', 4, 5, 10, 10, 10, 'madinah', 'sydney', 'mubashirmh04457@gmail.com', '+61412345678', 'mubashirmh04@gmail.com', '+61412345679')
      await requestNewShipment(token, 'crate', 'appliances', 4, 5, 10, 10, 10, 'madinah', 'sydney', 'mubashirmh04457@gmail.com', '+61412345678', 'mubashirmh04@gmail.com', '+61412345679')

        const res = await requestActiveShipments(token, 1, 2);
        const data = res.body;

        expect(res.statusCode).toStrictEqual(200);
        expect(data).toStrictEqual({ 
          result: expect.arrayContaining([
            expect.objectContaining({
              itemDescription: 'clothings',
              quantity: 4,
              weight: 5,
              destination: 'madinah',
              origin: 'sydney',
              packageType: 'box',
              senderEmail: 'mubashirmh04457@gmail.com',
              senderPhone: '+61412345678',
              recipientEmail: 'mubashirmh04@gmail.com',
              recipientPhone: '+61412345679',
              completed: false,
              _id: expect.any(String),
              userId: expect.any(String),
              __v: expect.any(Number),
              orderNumber: expect.any(Number),
            }),
            expect.objectContaining({
              itemDescription: 'appliances',
              quantity: 4,
              weight: 5,
              destination: 'madinah',
              origin: 'sydney',
              packageType: 'crate',
              senderEmail: 'mubashirmh04457@gmail.com',
              senderPhone: '+61412345678',
              recipientEmail: 'mubashirmh04@gmail.com',
              recipientPhone: '+61412345679',
              completed: false,
              _id: expect.any(String),
              userId: expect.any(String),
              __v: expect.any(Number),
              orderNumber: expect.any(Number),
            })
          ])
        });
    })
})
