import express, { json, Request, Response, NextFunction } from "express";
import Expo from "expo-server-sdk";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { clear } from "./clear";
import { authRouter } from "./routes/auth";
import { shipmentsCustomerRouter } from "./routes/shipmentsCustomer";
import { shipmentsAdminRouter } from "./routes/shipmentsAdmin";
import NotificationRouter from "./routes/notifications";

// Load dotenv FIRST, but only if vars aren't already set (e.g., in CI)
if (!process.env.MONGODB_URI) {
  dotenv.config();
}

export const app = express();
export const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

app.set("trust proxy", 1); // Trust first proxy (Render's proxy)

app.use(json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: true, // Allow all origins for mobile apps
    credentials: true,
  })
);

app.use(cookieParser());

// Utility endpoint for testing
app.delete("/clear", async (req: Request, res: Response) => {
  try {
    const result = await clear();
    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Core app features
app.use("/auth", authRouter);
app.use("/shipments-customer", shipmentsCustomerRouter);
app.use("/shipments-admin", shipmentsAdminRouter);
app.use("/notifications", NotificationRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("ERROR CAUGHT:", err);
  console.error("Stack:", err.stack);
  res.status(500).json({ error: err.message, stack: err.stack });
});
