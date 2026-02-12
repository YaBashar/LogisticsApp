import axios from "axios";
import Constants from "expo-constants";

const LOCAL_URL = "https://heriberto-unflowing-conclusionally.ngrok-free.dev";
const PROD_URL = Constants.expoConfig?.extra?.apiUrl || "https://logisticsapp-uldj.onrender.com";

// Automatically use local in dev, production in builds
const BASE_URL = __DEV__ ? LOCAL_URL : PROD_URL;
console.log("Using API URL:", BASE_URL, __DEV__ ? "(LOCAL)" : "(PRODUCTION)");

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true", // Add it here too just in case!
    "X-Client-Type": "mobile",
  },
});

// 3. Private instance
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // MUST be inside the headers object
    "X-Client-Type": "mobile",
  },
});
