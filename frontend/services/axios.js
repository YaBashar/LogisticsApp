import axios from "axios";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.apiUrl || "";

// Expo tunnel only exposes Metro; backend should be reachable at apiUrl.
const BASE_URL = API_URL;
console.log("Using API URL:", BASE_URL);

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
