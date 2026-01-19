import dotenv from 'dotenv';
import { requestAuthLogin, requestAuthRegister, requestDelete, requestNewShipment } from '../requestHelpers';
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
    // Test all paramaters
    // Name
    test('Name Empty', async() => {
        const res = await requestNewShipment(token, 'clothing', 4, 'madinah', 'sydney')
        const data = res.body;

        expect(res.statusCode).toStrictEqual(400);
        expect(data).toStrictEqual({ error: expect.any(String)});
    });

    
    // Item Description
    test('Item Description Empty Empty', async() => {
        const res = await requestNewShipment(token, '', 4,  'madinah', 'sydney')
        const data = res.body;

        expect(res.statusCode).toStrictEqual(400);
        expect(data).toStrictEqual({ error: expect.any(String)});
    });
    // Quantity
    test('Quantity has to be > 0', async() => {
        const res = await requestNewShipment(token,  'clothings', 0,  'madinah', 'sydney')
        const data = res.body;

        expect(res.statusCode).toStrictEqual(400);
        expect(data).toStrictEqual({ error: expect.any(String)});
    });

    test('Quantity must be a whole number', async() => {
        const res = await requestNewShipment(token, 'clothings', 4.3,  'madinah', 'sydney')
        const data = res.body;

        expect(res.statusCode).toStrictEqual(400);
        expect(data).toStrictEqual({ error: expect.any(String)});
    });

    test('Quantity cannot exceed 1 000 000', async() => {
        const res = await requestNewShipment(token, 'clothings', 10000000,  'madinah', 'sydney')
        const data = res.body;

        expect(res.statusCode).toStrictEqual(400);
        expect(data).toStrictEqual({ error: expect.any(String)});
    });
    

    // Origin + Destination
    test('Origin and Destination cannot be the same', async() => {
        const res = await requestNewShipment(token, 'clothings', 4,  'sydney', 'sydney')
        const data = res.body;

        expect(res.statusCode).toStrictEqual(400);
        expect(data).toStrictEqual({ error: expect.any(String)});
    });

    test('Invalid Token', async () => {
        const res = await requestNewShipment('invalidTOken', 'clothing', 4,  'madinah', 'sydney')
        const data = res.body;

        expect(res.statusCode).toStrictEqual(401);
        expect(data).toStrictEqual({ error: expect.any(String)});
    })
});


describe('Success', () => {

    test('Success', async () => {
        const res = await requestNewShipment(token,  'clothing', 4,  'madinah', 'sydney')
        const data = res.body;
        console.log(data)

        expect(res.statusCode).toStrictEqual(200);
        expect(data).toStrictEqual({ result: expect.any(String)});
    })
});


