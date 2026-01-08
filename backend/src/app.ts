import express, { json, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { clear } from './clear';
import { authRouter } from './routes/auth';

export const app = express();
app.use(json());
app.use(morgan('dev'));
app.use(cors({
  origin: true, // Allow all origins for mobile apps
  credentials: true,
}));

app.use(cookieParser())
dotenv.config();

// Utility endpoint for testing
app.delete('/clear', async(req: Request, res: Response) => {
  try {
    const result = await clear();
    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({error : error.message })
  }
})

// Core app features
app.use('/auth', authRouter)