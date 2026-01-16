import dotenv from 'dotenv';
import { requestActiveShipments, requestAuthLogin, requestAuthRegister, requestCompletedShipments, requestDelete, requestNewShipment } from '../requestHelpers';
import mongoose from 'mongoose';
import { ShipmentModel } from '../../models/shipmentsModel';

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
        await requestNewShipment(token, 'order1', 'clothing', 4, new Date(2026, 5, 15), 'madinah', 'sydney');
        const res = await requestCompletedShipments('invalidToken');
        const data = res.body;

        expect(res.statusCode).toStrictEqual(401);
        expect(data).toStrictEqual({error: expect.any(String)});
    })
})


describe('Success', () => {
    test('Success', async () => {
        const res1 = await requestNewShipment(token, 'order1', 'clothing', 4, new Date(2026, 5, 15), 'madinah', 'sydney');
        await requestNewShipment(token, 'order2', 'shoes', 2, new Date(2026, 6, 15), 'madinah', 'sydney');
  
        // Get the shipment IDs from the responses
        const shipmentId1 = res1.body.result;
        console.log(shipmentId1)
        
        // Mark first shipment as completed
        await ShipmentModel.findByIdAndUpdate(shipmentId1, { completed: true });

        const res = await requestCompletedShipments(token);
        const data = res.body;

        expect(res.statusCode).toStrictEqual(200);
        expect(data).toStrictEqual({ 
          result: expect.arrayContaining([
            expect.objectContaining({
              name: 'order1',
              itemDescription: 'clothing',
              quantity: 4,
              destination: 'madinah',
              origin: 'sydney',
              completed: true,
              _id: expect.any(String),
              userId: expect.any(String),
            })
          ])
        });
    })
})