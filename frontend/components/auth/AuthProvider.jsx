import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refresh, validate, syncApiUrl, rememberApiUrl } from "@/utils/tokenManager";
import * as SecureStorage from "expo-secure-store";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";

async function applyTokenClaims(accessToken, setRole, setUserId) {
  const decoded = jwtDecode(accessToken);
  const safeRole = typeof decoded?.role === "string" ? decoded.role : "";
  const safeUserId = typeof decoded?.sub === "string" ? decoded.sub : "";

  if (safeRole) {
    await AsyncStorage.setItem("role", safeRole);
    setRole(safeRole);
  }
  if (safeUserId) {
    await AsyncStorage.setItem("userId", safeUserId);
    setUserId(safeUserId);
  }
}

function AuthProvider({ children }) {
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        await syncApiUrl();

        const savedAccessToken = await AsyncStorage.getItem("accessToken");
        const savedUserId = await AsyncStorage.getItem("userId");
        const savedRefreshToken = await SecureStorage.getItemAsync("refreshToken");

        if (savedUserId) setUserId(savedUserId);

        if (savedAccessToken && savedRefreshToken) {
          const isValid = await validate(savedAccessToken);

          if (isValid) {
            setAccessToken(savedAccessToken);
            setRefreshToken(savedRefreshToken);
            await applyTokenClaims(savedAccessToken, setRole, setUserId);
            setIsAuthenticated(true);
          } else {
            try {
              const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
                await refresh();
              await AsyncStorage.setItem("accessToken", newAccessToken);
              await SecureStorage.setItemAsync("refreshToken", newRefreshToken);
              setAccessToken(newAccessToken);
              setRefreshToken(newRefreshToken);
              await applyTokenClaims(newAccessToken, setRole, setUserId);
              setIsAuthenticated(true);
            } catch (error) {
              const message = error?.response?.data?.error || error?.message;
              console.warn("Session expired, please log in again:", message);
              await logout();
            }
          }
        }
      } catch (error) {
        console.error("Failed to load Auth", error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();
  }, []);

  const login = async (accessToken, refreshToken) => {
    const safeAccessToken = typeof accessToken === "string" ? accessToken : "";
    const safeRefreshToken = typeof refreshToken === "string" ? refreshToken : "";

    if (!safeAccessToken || !safeRefreshToken) {
      throw new Error("Invalid tokens provided to login()");
    }

    await AsyncStorage.setItem("accessToken", safeAccessToken);
    await SecureStorage.setItemAsync("refreshToken", safeRefreshToken);
    await rememberApiUrl();

    setAccessToken(safeAccessToken);
    setRefreshToken(safeRefreshToken);

    await applyTokenClaims(safeAccessToken, setRole, setUserId);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await SecureStorage.deleteItemAsync("refreshToken");
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("role");
    setIsAuthenticated(false);
    setAccessToken("");
    setRefreshToken("");
    setRole("");
    setUserId("");
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  const contextValue = {
    userId,
    accessToken,
    role,
    refreshToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export { AuthProvider };
