import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStorage from "expo-secure-store";
import { AuthContext } from "./AuthContext";

function AuthProvider({ children }) {
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedAccessToken = await AsyncStorage.getItem("accessToken");
        const savedUserRole = await AsyncStorage.getItem("role");
        const savedUserId = await AsyncStorage.getItem("userId");
        const savedRefreshToken = await SecureStorage.getItemAsync("refreshToken");

        if (savedUserId) setUserId(savedUserId);
        if (savedAccessToken) setAccessToken(savedAccessToken);
        if (savedRefreshToken) setRefreshToken(savedRefreshToken);
        if (savedUserRole) setRole(savedUserRole);
      } catch (error) {
        console.error("Failed to load Auth", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();
  }, []);

  const persistSetAccessToken = async (accessToken) => {
    setAccessToken(accessToken);
    if (accessToken) {
      await AsyncStorage.setItem("accessToken", accessToken);
    } else {
      await AsyncStorage.removeItem("accessToken");
    }
  };

  const persistSetRefreshToken = async (token) => {
    setRefreshToken(token);
    if (token) {
      await SecureStorage.setItemAsync("refreshToken", token); // Secure!
    } else {
      await SecureStorage.deleteItemAsync("refreshToken"); // Secure!
    }
  };

  const persistSetUserRole = async (role) => {
    setRole(role);
    if (role) {
      await AsyncStorage.setItem("role", role);
    } else {
      await AsyncStorage.removeItem("role");
    }
  };

  const persistSetUserId = async (id) => {
    setUserId(id);
    if (id) {
      await AsyncStorage.setItem("userId", id);
    } else {
      await AsyncStorage.removeItem("userId");
    }
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  const contextValue = {
    userId,
    persistSetUserId,
    accessToken,
    persistSetAccessToken,
    role,
    persistSetUserRole,
    refreshToken,
    persistSetRefreshToken,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export { AuthProvider };
