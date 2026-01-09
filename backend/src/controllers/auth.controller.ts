import { Request, Response } from 'express';
import { registerUser, userLogin, authRefresh, userDetails, verifyEmail, resendVerificationCode, requestResetPassword } from '../service/auth';

export const register = async (req: Request, res:Response) => {
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
}

export const login = async (req: Request, res: Response) => {
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
}

export const refresh = async (req: Request, res: Response) =>{
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'Authentication Required' });

  try { 
    const {accessToken, refreshToken: newRefreshToken} = await authRefresh(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
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
}

export const userVerifyEmail = async (req: Request, res: Response) => {
  const { verificationCode } = req.body;
  try {
    const result = await verifyEmail(verificationCode);
    res.status(200).json({message: "Successfully Verified"})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

export const resendVerifyEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const result = await resendVerificationCode(email);
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({error : error.message})
  }
}

export const requestPasswordReset = async (req: Request, res: Response ) => {
  const { email } = req.body;

  try {
    const result = await requestResetPassword(email);
    res.status(200).json({result})
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const userInfo = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    const result = await userDetails(userId);
    res.status(200).json({ user: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}