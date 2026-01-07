import express, { json, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import config from '../config.json';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { authRefresh, registerUser, userDetails, userLogin } from './auth';
import { clear } from './clear';
import { verifyJWT } from './middleware';

export const app = express();
app.use(json());
app.use(morgan('dev'));
app.use(cors({
  origin: true, // Allow all origins for mobile apps
  credentials: true,
}));
app.use(cookieParser())

dotenv.config();

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================
app.delete('/clear', async(req: Request, res: Response) => {
  try {
    const result = await clear();
    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({error : error.message })
  }
})

const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                     
  message: 'Too many registration attempts. Please try again later.',
  standardHeaders: true,      
  legacyHeaders: false,       
  keyGenerator: (req) => {
    return `${req.ip}-${req.body.email || 'no-email'}`;
  }
});

app.post('/auth/register', registrationLimiter,async (req: Request, res:Response) => {
  
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await registerUser(firstName, lastName, password, email);
    return res.status(201).json({ userId: result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: true
});

app.post('/auth/login', loginLimiter, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { accessToken, refreshToken } = await userLogin(email, password);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/auth'
    });

    return res.status(200).json({ token: accessToken });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid Credentials' });
  }
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many refresh attempts please try again later',
  standardHeaders: true,
  legacyHeaders: true
})

app.post('/auth/refresh', refreshLimiter, async (req: Request, res: Response) =>{

  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) return res.status(401).json({ error: 'Authentication Required' });

  try { 
    const {accessToken, refreshToken: newRefreshToken} = await authRefresh(refreshToken);
    
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/auth'
    });

    return res.status(200).json({ token: accessToken });

  } catch (error) {

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth'
    });

    return res.status(400).json({ error: error.message });
  }
});

app.get('/auth/user-details', verifyJWT, async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    const result = await userDetails(userId);
    res.status(200).json({ user: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

const PORT: number = parseInt(process.env.port || config.port);
const HOST: string = process.env.host || '0.0.0.0';

export const server = app.listen(PORT, HOST, () => {
  console.log(`Server listening on port ${PORT} at host ${HOST}`);
});

mongoose.connect(process.env.MONGODB_URI, {
})
  .then(() => console.log('DB Connection Successful'));


app.use((req: Request, res: Response) => {
  const error = `
    Route not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.status(404).json({ error });
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed gracefully');
    process.exit();
  });
});

