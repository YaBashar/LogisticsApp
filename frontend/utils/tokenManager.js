import { jwtDecode } from "jwt-decode";
import axios from "../services/axios";
import * as SecureStorage from "expo-secure-store";

const validate = async (savedAccessToken, savedRefreshToken) => {
  if (!savedAccessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(savedAccessToken);
    const currentTime = Date.now() / 1000;

    if (decoded.exp > currentTime + 30) {
      return true;
    }

    // Token is expired or about to expire
    return false;
  } catch (error) {
    console.error("Token Validation Error", error);
    return false;
  }
};

const refresh = async () => {
  const refreshToken = await SecureStorage.getItemAsync("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh Token available");
  }

  const response = await axios.post("/auth/refresh", { refreshToken });
  const { accessToken, refreshToken: newRefreshToken } = response.data;

  await SecureStorage.setItemAsync("refreshToken", newRefreshToken);
  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export { validate, refresh };
