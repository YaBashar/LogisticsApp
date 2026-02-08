import axios from "../services/axios";
import * as SecureStorage from "expo-secure-store";

const useRefreshToken = () => {
  const refresh = async () => {
    const refreshToken = await SecureStorage.getItemAsync("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh Token available");
    }

    console.log("Refreshing with token:", refreshToken);
    const response = await axios.post("/auth/refresh", { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    await SecureStorage.setItemAsync("refreshToken", newRefreshToken);
    return accessToken;
  };

  return refresh;
};

export default useRefreshToken;
