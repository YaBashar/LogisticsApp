import express from 'express';
import * as AuthController from '../controllers/auth.controller'
import { registrationLimiter, loginLimiter, refreshLimiter, verifyJWT } from '../middleware';

export const authRouter = express.Router();

authRouter.post('/register', registrationLimiter, AuthController.register);
authRouter.post('/login', loginLimiter, AuthController.login);
authRouter.post('/refresh', refreshLimiter, AuthController.refresh);
authRouter.get('/auth/user-details', verifyJWT, AuthController.userInfo);