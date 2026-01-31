// scripts/createAdmin.js
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserModel } from "./models/userModel";

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI_PROD);
    console.log("Connected to MongoDB");

    const adminExists = await UserModel.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    const newUser = new UserModel({
      name: process.env.ADMIN_NAME || "Admin",
      email: process.env.ADMIN_EMAIL.toLowerCase().trim(),
      password: hashedPassword,
      refreshTokens: [],
      role: "admin",
      loginAttempts: 0,
      accountLocked: false,
      emailVerified: true,
    });

    await newUser.save();

    console.log("Admin created successfully!");
    console.log(`Email: ${process.env.ADMIN_EMAIL}`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

createAdmin();
