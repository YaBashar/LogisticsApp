import {
  checkEmail,
  checkPassword,
  checkName,
  hashPassword,
  generateCode,
} from "../utils/authHelper";
import { UserModel } from "../models/userModel";
import {
  newSignUpTemplate,
  resetPasswordTemplate,
  verifyEmailTemplate,
} from "../utils/emailTemplates";
import logger from "../utils/logger";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { sendEmail } from "./email";
const SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

/** [1] AuthRegister
 * Registers a user with an email, password, and name
 **/

async function registerUser(
  firstName: string,
  lastName: string,
  password: string,
  email: string
): Promise<string> {
  // Sanitize inputs for security
  const sanitizedFirstName = firstName.trim();
  const sanitizedLastName = lastName.trim();
  const normalisedEmail = email.toLowerCase().trim();
  const name = `${sanitizedFirstName} ${sanitizedLastName}`;

  try {
    checkName(name);
    await checkEmail(normalisedEmail);
    checkPassword(password);
  } catch (error) {
    logger.warn("Registration validation failed", {
      error: error.message,
      email: normalisedEmail,
      timestamp: new Date().toISOString(),
    });

    throw new Error("Registration failed. Please check your information and try again.");
  }

  const { code, expiry } = generateCode();
  const hashedPassword = await hashPassword(password);
  const newUser = new UserModel({
    name: name,
    email: normalisedEmail,
    password: hashedPassword,
    refreshTokens: [],
    role: "customer",
    loginAttempts: 0,
    accountLocked: false,
    verificationCode: code, // change to hash for prod
    verificationCodeExpiry: expiry,
    emailVerified: false,
  });

  await newUser.save();

  if (process.env.NODE_ENV !== "test") {
    const welcomeEmail = newSignUpTemplate(sanitizedFirstName, normalisedEmail);
    const verificationEmail = verifyEmailTemplate(normalisedEmail, code);

    Promise.all([
      sendEmail(welcomeEmail.to, welcomeEmail.subject, welcomeEmail.html),
      sendEmail(verificationEmail.to, verificationEmail.subject, verificationEmail.html),
    ]).catch((emailError) => {
      console.error("Error sending emails:", emailError);
      // Don't fail registration if emails fail
    });
  }

  return newUser._id.toString();
}

/** [2] Auth Login
 * Logs in a user
 **/

async function userLogin(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Invalid Credentials");
  }

  const normalisedEmail = email.toLowerCase().trim();
  const user = await UserModel.findOne({ email: normalisedEmail });

  if (!user) {
    throw new Error("Invalid Email or Password");
  }

  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) {
    throw new Error("Invalid Email or Password");
  }

  const accessToken = jwt.sign({ userId: user._id, role: user.role }, SECRET, {
    expiresIn: "10m",
  });

  const refreshToken = jwt.sign({ userId: user._id, role: user.role }, REFRESH_SECRET, {
    expiresIn: "1d",
  });

  // remove expired refreshTokens
  user.refreshTokens = user.refreshTokens.filter((token) => {
    try {
      jwt.verify(token, REFRESH_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  });

  user.refreshTokens.push(refreshToken);

  // Limit to 5 active sessions
  const MAX_SESSIONS = 5;
  if (user.refreshTokens.length > MAX_SESSIONS) {
    user.refreshTokens = user.refreshTokens.slice(-MAX_SESSIONS);
  }

  await user.save();
  return { accessToken, refreshToken };
}

/** [3] Auth Refresh
 * Allows user to stay loggedIn
 **/
async function authRefresh(refreshToken: string) {
  let decoded;

  try {
    decoded = jwt.verify(refreshToken, REFRESH_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await UserModel.findOneAndUpdate(
    { _id: (decoded as any).userId, refreshTokens: refreshToken },
    { $pull: { refreshTokens: refreshToken } },
    { new: true }
  );

  if (!user) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = jwt.sign({ userId: user._id, role: user.role }, SECRET, {
    expiresIn: "10m",
  });

  const newRefreshToken = jwt.sign({ userId: user._id, role: user.role }, REFRESH_SECRET, {
    expiresIn: "1d",
  });

  user.refreshTokens.push(newRefreshToken);
  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
}

async function verifyEmail(verificationCode: string) {
  const user = await UserModel.findOne({ verificationCode: verificationCode });
  if (!user) {
    throw new Error("Invalid Verification Code");
  }

  if (user.verificationCodeExpiry && user.verificationCodeExpiry < new Date()) {
    throw new Error("Verification code has expired");
  }

  user.verificationCode = null;
  user.verificationCodeExpiry = null;
  user.emailVerified = true;
  user.updatedAt = new Date();

  await user.save();
  return { success: true };
}

async function resendVerificationCode(email: string) {
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    throw new Error("Email not found");
  }

  const { code, expiry } = generateCode();

  await UserModel.findOneAndUpdate(
    { _id: user._id },
    { $set: { verificationCode: code, verificationCodeExpiry: expiry } }
  );

  const verifyEmail = verifyEmailTemplate(email, code);

  if (process.env.NODE_ENV !== "test") {
    console.log("📧 Resending verification code to:", verifyEmail.to);
    console.log("🔑 Verification code:", code);

    try {
      await sendEmail(verifyEmail.to, verifyEmail.subject, verifyEmail.html);
      console.log("✅ Verification code resent successfully");
    } catch (error) {
      console.error("❌ Failed to resend verification code:", error);
      // They're waiting for this - should probably show an error
    }
  }

  return { success: true };
}

async function userResendResetCode(email: string) {
  const normalisedEmail = email.toLowerCase().trim();
  const user = await UserModel.findOne({ email: normalisedEmail });
  if (!user) {
    throw new Error("Email not found");
  }

  const { code, expiry } = generateCode();

  await UserModel.findOneAndUpdate(
    { _id: user._id },
    { $set: { resetCode: code, resetCodeExpiry: expiry } }
  );

  const resetCodeEmail = resetPasswordTemplate(normalisedEmail, code);

  if (process.env.NODE_ENV !== "test") {
    console.log("📧 Resending code to:", resetCodeEmail.to);
    console.log("🔑 New reset code:", code);

    try {
      await sendEmail(resetCodeEmail.to, resetCodeEmail.subject, resetCodeEmail.html);
      console.log("✅ Reset code resent successfully");
    } catch (error) {
      console.error("❌ Failed to resend reset code:", error);
      // User clicked "resend" - they need to know if it failed
    }
  }

  return { success: true };
}

async function requestResetPassword(email: string) {
  const normalisedEmail = email.toLowerCase().trim();
  const user = await UserModel.findOne({ email: normalisedEmail });
  if (!user) {
    throw new Error("Email not found");
  }

  const { code, expiry } = generateCode();

  user.resetCode = code;
  user.resetCodeExpiry = expiry;

  await user.save();

  if (process.env.NODE_ENV !== "test") {
    const resetPasswordEmail = resetPasswordTemplate(normalisedEmail, code);

    console.log("📧 Attempting to send email to:", resetPasswordEmail.to);
    console.log("🔑 Reset code:", code);

    try {
      const result = await sendEmail(
        resetPasswordEmail.to,
        resetPasswordEmail.subject,
        resetPasswordEmail.html
      );
      console.log("✅ Email sent successfully:", result);
    } catch (error) {
      console.error("❌ Email error:", error);
    }
  }

  return { success: true };
}

async function userVerifyResetCode(resetCode: string) {
  const user = await UserModel.findOne({
    resetCode,
    resetCodeExpiry: { $gt: new Date() }, // Check expiry in one query
  });

  if (!user) {
    throw new Error("Invalid or expired reset code");
  }

  return { success: true };
}

async function userResetPassword(resetCode: string, newPassword: string) {
  if (newPassword.length < 12) {
    throw new Error("Password must be at least 12 characters");
  }

  const user = await UserModel.findOne({
    resetCode,
    resetCodeExpiry: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset code");
  }

  // Check if new password is same as current
  if (await bcrypt.compare(newPassword, user.password)) {
    throw new Error("New password must be different from your current password");
  }

  try {
    checkPassword(newPassword);
  } catch (error) {
    throw new Error("Invalid password, please follow password rules");
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  user.resetCode = undefined;
  user.resetCodeExpiry = undefined;
  user.updatedAt = new Date();

  await user.save();

  return { success: true };
}

async function userDetails(userId: string) {
  const currUser = await UserModel.findById(userId);

  if (!currUser) {
    throw new Error("User Id Invalid");
  }

  return {
    userId: currUser._id,
    name: currUser.name,
    email: currUser.email,
    role: currUser.role,
  };
}

async function userChangePassword(userId: string, currentPassword: string, newPassword: string) {
  if (newPassword.length < 12) {
    throw new Error("Password must be at least 8 characters");
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error("Invalid or expired reset code");
  }

  // Verify current password is valid
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  // Check if new password is same as current
  if (await bcrypt.compare(newPassword, user.password)) {
    throw new Error("New password must be different from your current password");
  }

  try {
    checkPassword(newPassword);
  } catch (error) {
    throw new Error("Invalid password, please follow password rules");
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  user.updatedAt = new Date();

  await user.save();

  return { success: true };
}

export {
  registerUser,
  userLogin,
  authRefresh,
  userDetails,
  verifyEmail,
  resendVerificationCode,
  requestResetPassword,
  userResetPassword,
  userVerifyResetCode,
  userChangePassword,
  userResendResetCode,
};
