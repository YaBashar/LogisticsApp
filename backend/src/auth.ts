import { checkEmail, checkPassword, checkName, hashPassword, checkNewPasswd } from './utils/authHelper';
import { UserModel } from './models/userModel';




import bcrypt from 'bcrypt';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

/** [1] AuthRegister
  * Registers a user with an email, password, and name
**/

async function registerUser(firstName: string, lastName: string, password: string, email: string): Promise<string> {
  const name = firstName + ' ' + lastName;

  try {
    checkName(name);
    await checkEmail(email);
    checkPassword(password);
  } catch (error) {
    throw new Error(error.message);
  }

  const hashedPassword = await hashPassword(password);
  const newUser = new UserModel({
    name: name,
    password: hashedPassword,
    email: email
  });

  await newUser.save();
  return newUser._id.toString();
}

/** [2] Auth Login
  * Logs in a user
**/

async function userLogin(email: string, password: string) {
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    throw new Error('Email does not exist');
  }

  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) {
    throw new Error('Invalid Email or Password');
  }

  const accessToken = jwt.sign(
    { userId: user._id, name: user.name, email: user.email, role: user.role },
    SECRET,
    { expiresIn: '10m' });

  const refreshToken = jwt.sign(
    { userId: user._id, name: user.name, email: user.email, role: user.role },
    REFRESH_SECRET,
    { expiresIn: '1d' }
  );

  user.refreshTokens = [refreshToken];
  await user.save();
  return { accessToken, refreshToken };
}

/** [3] Auth Refresh
  * Allows user to stay loggedIn
**/
async function authRefresh(refreshToken: string) {
  const user = await UserModel.findOne({ refreshTokens: { $in: [refreshToken] } });

  if (!user) {
    throw new Error('Invalid Refresh token for user');
  }

  try {
    jwt.verify(refreshToken, REFRESH_SECRET);
  } catch (error) {
    // Delete Expired Refresh Token from User
    const refreshTokenIndex = user.refreshTokens.findIndex((rfToken) => rfToken === refreshToken);
    user.refreshTokens.splice(refreshTokenIndex, 1);
    throw new Error(error.message);
  }

  const accessToken = jwt.sign(
    { userId: user._id, name: user.name, email: user.email, role: user.role },
    SECRET,
    { expiresIn: '10m' });

  return accessToken;
}



async function userDetails(userId: string) {
  const currUser = await UserModel.findById(userId);

  if (!currUser) {
    throw new Error('User Id Invalid');
  }

  return {
    userId: currUser._id,
    name: currUser.name,
    email: currUser.email,
    role: currUser.role
  };
}

export { registerUser, userLogin, authRefresh, userDetails };
