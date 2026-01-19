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
      await requestNewShipment(token, 'clothing', 4, 'madinah', 'sydney')
      await requestNewShipment(token, 'moreclothing', 4, 'madinah', 'sydney')
       
      const res = await requestActiveShipments('invalidToken');
      const data = res.body;

      expect(res.statusCode).toStrictEqual(401);
      expect(data).toStrictEqual({error: expect.any(String)});
  })
})


describe('Success', () => {

    test('Success', async () => {
        await requestNewShipment(token,'clothing', 4, 'madinah', 'sydney')
        await requestNewShipment(token, 'moreclothing', 4, 'madinah', 'sydney')
       
        const res = await requestActiveShipments(token);
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
              userId: expect.any(String),
            }),
            expect.objectContaining({
              name: 'Anoterneworder',
              itemDescription: 'moreclothing',
              quantity: 4,
              completed: false,
            })
          ])
        });
    })
});
