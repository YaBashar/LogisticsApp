import dotenv from "dotenv";

// Load dotenv FIRST, before any other imports
if (!process.env.MONGODB_URI_PROD) {
  dotenv.config();
}

import { app } from "./app";
import mongoose from "mongoose";

const PORT: number = parseInt(process.env.PORT || "3229");
const HOST: string = process.env.host || "0.0.0.0";

const MONGODB_URI =
  process.env.NODE_ENV === "test" ? process.env.MONGODB_URI : process.env.MONGODB_URI_PROD;

mongoose
  .connect(MONGODB_URI!)
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.error("DB Connection Failed:", err));

export const server = app.listen(PORT, HOST, () => {
  console.log(`Server listening on port ${PORT} at host ${HOST}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed gracefully");
    process.exit();
  });
});
