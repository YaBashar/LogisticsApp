import "dotenv/config";
import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_ACCESS_SECRET;

import { UserModel } from "./models/userModel";
import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: "customer" | "admin";
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ error: "Authentication Required" });
    return;
  }

  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(token, SECRET) as JwtPayload;
  } catch {
    res.status(401).json({ error: "Authentication Required" });
    return;
  }

  try {
    const dbUser = await UserModel.findById(decoded.sub).select("deletedAt").lean();
    if (!dbUser) {
      res.status(401).json({ error: "Authentication Required" });
      return;
    }
    if (dbUser.deletedAt != null) {
      res.status(403).json({
        error:
          "This account was deleted. Restore it within 30 days or it will be removed permanently.",
        code: "ACCOUNT_SOFT_DELETED",
      });
      return;
    }

    req.user = decoded;
    next();
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
}

// Limits registration attempts to 5 per IP every 15 minutes to prevent abuse.
// Skipped in test environments.
export const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "test" ? 1000 : 5,
  message: { error: "Too many registration attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 1000 : 5,
  message: { error: "Too many login attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

export const resendVerifLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 1000 : 3,
  skipFailedRequests: false,
  standardHeaders: true,
  legacyHeaders: false,
});

export const verifyEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "test" ? 1000 : 10,
  message: { error: "Too many verification attempts. Please request a new code." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 1000 : 10,
  message: { error: "Too many refresh attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 1000 : 5,
  message: { error: "Too many password reset attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resetCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 1000 : 5,
  message: { error: "Too many attempts. Please request a new reset code." },
  standardHeaders: true,
  legacyHeaders: false,
});
