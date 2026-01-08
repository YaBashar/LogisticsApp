import 'dotenv/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET;
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) return res.status(401).json({ error: 'Unauthorised: No token proivded' });

  const token = authHeaders.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorised: Malformed JWT Token' });

  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                     
  message: 'Too many registration attempts. Please try again later.',
  standardHeaders: true,      
  legacyHeaders: false,     
  skip: (req) => process.env.NODE_ENV === 'test',  
  keyGenerator: (req) => {
    // Always use IP address - can't be manipulated by attacker
    const ip = req.ip || 
               req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
               req.socket.remoteAddress || 
               'unknown';
    
    return `registration:${ip}`;
  }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: true
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many refresh attempts please try again later',
  standardHeaders: true,
  legacyHeaders: true
})

export { verifyJWT, registrationLimiter, loginLimiter, refreshLimiter };
