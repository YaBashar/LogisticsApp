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
 
  if (!email || !password) {
    throw new Error('Invalid Credentials');
  }
 
  const user = await UserModel.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    throw new Error('Invalid Email or Password');
  }

  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) {
    throw new Error('Invalid Email or Password');
  }

  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    SECRET,
    { expiresIn: '10m' });

  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    REFRESH_SECRET,
    { expiresIn: '1d' }
  );

  // remove expired refreshTokens
  user.refreshTokens = user.refreshTokens.filter(token => {
    try {
      jwt.verify(token, REFRESH_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  })

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
    throw new Error('Invalid or expired refresh token');
  }

  const user = await UserModel.findOneAndUpdate(
    { _id: (decoded as any).userId, refreshTokens: refreshToken },
    { $pull: { refreshTokens: refreshToken } },
    { new: true }
  );
  
  if (!user) {
    throw new Error('Invalid refresh token');
  }

  const accessToken = jwt.sign(
    { userId: user._id, name: user.name, email: user.email, role: user.role },
    SECRET,
    { expiresIn: '10m' });

  const newRefreshToken = jwt.sign(
    { userId: user._id, name: user.name, email: user.email, role: user.role },
    REFRESH_SECRET,
    { expiresIn: '1d' }
  );

  user.refreshTokens.push(newRefreshToken);
  await user.save();

  return {accessToken, refreshToken: newRefreshToken};
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
