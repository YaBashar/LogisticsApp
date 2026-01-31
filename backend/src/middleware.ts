import "dotenv/config";
import jwt, { JwtPayload } from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET;
import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) {
    return res.status(401).json({ error: "Unauthorised: No token proivded" });
  }

  const token = authHeaders.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorised: Malformed JWT Token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many registration attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "test",
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 1000 : 5,
  message: "Too many login attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: true,
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many refresh attempts please try again later",
  standardHeaders: true,
  legacyHeaders: true,
});

const resendVerifLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.body.email, // Rate limit per email
  message:
    "Too many attempts to resend verification code, Please try again later",
  standardHeaders: true,
  legacyHeaders: true,
});

const verifyEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  keyGenerator: (req) => req.body.email, // Per email
  message: "Too many verification attempts. Please request a new code.",
  standardHeaders: true,
  legacyHeaders: false,
});

export {
  verifyJWT,
  registrationLimiter,
  loginLimiter,
  refreshLimiter,
  resendVerifLimiter,
  verifyEmailLimiter,
};
