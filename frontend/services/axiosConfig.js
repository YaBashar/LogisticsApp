import { refresh } from "../utils/tokenManager";
import { axiosPrivate } from "../services/axios";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStorage from "expo-secure-store";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

async function clearSessionAndGoToLogin(accountDeletedHint = false) {
  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("role");
  await AsyncStorage.removeItem("userId");
  await SecureStorage.deleteItemAsync("refreshToken");

  if (accountDeletedHint) {
    router.replace({
      pathname: "/auth/login",
      params: { accountDeleted: "1" },
    });
  } else {
    router.replace("/auth/login");
  }
}

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 403 && error?.response?.data?.code === "ACCOUNT_SOFT_DELETED") {
      await clearSessionAndGoToLogin(true);
      return Promise.reject(error);
    }

    const originalRequest = error?.config;

    if (error?.response?.status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        // Wait for the refresh to complete
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });

          // Now use the token
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axiosPrivate(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokens = await refresh();

        processQueue(null, tokens.accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${tokens.accessToken}`;
        return axiosPrivate(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("role");
        await AsyncStorage.removeItem("userId");
        await SecureStorage.deleteItemAsync("refreshToken");

        router.replace("/auth/login");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

axiosPrivate.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
