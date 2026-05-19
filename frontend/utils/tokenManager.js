import { jwtDecode } from "jwt-decode";
import axios from "../services/axios";
import * as SecureStorage from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_URL_STORAGE_KEY = "lastApiUrl";

let refreshPromise = null;

const getCurrentApiUrl = () => Constants.expoConfig?.extra?.apiUrl || "";

const validate = async (savedAccessToken) => {
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

const clearAuthStorage = async () => {
  await AsyncStorage.multiRemove(["accessToken", "role", "userId"]);
  await SecureStorage.deleteItemAsync("refreshToken");
};

/**
 * Clears stored tokens when the API base URL changes (e.g. ngrok vs Render).
 * Prevents refresh attempts with tokens issued by a different backend/database.
 */
const syncApiUrl = async () => {
  const currentApiUrl = getCurrentApiUrl();
  const storedApiUrl = await AsyncStorage.getItem(API_URL_STORAGE_KEY);

  if (storedApiUrl && currentApiUrl && storedApiUrl !== currentApiUrl) {
    await clearAuthStorage();
  }

  if (currentApiUrl) {
    await AsyncStorage.setItem(API_URL_STORAGE_KEY, currentApiUrl);
  }
};

const rememberApiUrl = async () => {
  const currentApiUrl = getCurrentApiUrl();
  if (currentApiUrl) {
    await AsyncStorage.setItem(API_URL_STORAGE_KEY, currentApiUrl);
  }
};

const refresh = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = (await SecureStorage.getItemAsync("refreshToken"))?.trim();

    if (!refreshToken) {
      throw new Error("No refresh Token available");
    }

    const response = await axios.post("/auth/refresh", { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    await AsyncStorage.setItem("accessToken", accessToken);
    await SecureStorage.setItemAsync("refreshToken", newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

export { validate, refresh, clearAuthStorage, syncApiUrl, rememberApiUrl };
