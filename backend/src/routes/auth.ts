import express from 'express';
import * as AuthController from '../controllers/auth.controller'
import { registrationLimiter, loginLimiter, refreshLimiter, resendVerifLimiter, verifyEmailLimiter, verifyJWT } from '../middleware';

export const authRouter = express.Router();

authRouter.post('/register', registrationLimiter, AuthController.register);
authRouter.post('/login', loginLimiter, AuthController.login);
authRouter.post('/refresh', refreshLimiter, AuthController.refresh);
authRouter.post('/verify-email', verifyEmailLimiter, AuthController.userVerifyEmail)
authRouter.post('/resend-verification', resendVerifLimiter, AuthController.resendVerifyEmail);
authRouter.post('/resend-reset-code', AuthController.resendResetCode)
authRouter.post('/request-reset-password', AuthController.requestPasswordReset);
authRouter.post('/verify-reset-code', AuthController.verifyResetCode);
authRouter.post('/reset-password', AuthController.resetPassword);
authRouter.post('/change-password', verifyJWT, AuthController.changePassword);
authRouter.get('/user-details', verifyJWT, AuthController.userInfo);
