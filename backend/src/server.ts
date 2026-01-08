import { app } from './app'
import config from '../config.json';
import mongoose from 'mongoose';

const PORT: number = parseInt(process.env.port || config.port);
const HOST: string = process.env.host || '0.0.0.0';

export const server = app.listen(PORT, HOST, () => {
  console.log(`Server listening on port ${PORT} at host ${HOST}`);
});

export const connectDB = async () => {
  return await mongoose.connect(process.env.MONGODB_URI);
};

connectDB().then(() => console.log('DB Connected'));


process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed gracefully');
    process.exit();
  });
});

