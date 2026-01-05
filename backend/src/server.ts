import express, { json, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import config from '../config.json';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import { authRefresh, registerUser, userDetails, userLogin } from './auth';
import { clear } from './clear';
import { verifyJWT } from './middleware';

export const app = express();
app.use(json());
app.use(morgan('dev'));
app.use(cors());
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

app.post('/auth/register', async (req: Request, res:Response) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const result = await registerUser(firstName, lastName, password, email);
    res.status(200).json({ userId: result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { accessToken, refreshToken } = await userLogin(email, password);
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({ token: accessToken });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/auth/refresh', async (req: Request, res: Response) =>{
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ error: 'Unauthorised' });

  const refreshToken = cookies.jwt;

  try {
    const result = await authRefresh(refreshToken);
    res.status(200).json({ token: result });
  } catch (error) {
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
const HOST: string = process.env.host || '127.0.0.1';

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

