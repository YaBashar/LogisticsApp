import mongoose from "mongoose";
import { UserModel } from "../models/userModel";
import { RefreshTokenModel } from "../models/refreshTokenModel";
import { ShipmentModel } from "../models/shipmentsModel";

export async function clear(): Promise<Record<string, never>> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("clear() cannot be called in production");
  }

  await Promise.all([
    UserModel.deleteMany({}),
    ShipmentModel.deleteMany({}),
    RefreshTokenModel.deleteMany({}),
  ]);

  return {};
}
