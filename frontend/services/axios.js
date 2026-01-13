import axios from 'axios';
import Constants from 'expo-constants';

const LOCAL_URL = "http://localhost:3229";
const PROD_URL = Constants.expoConfig?.extra?.apiUrl || "https://logisticsapp-uldj.onrender.com";

// Automatically use local in dev, production in builds
const BASE_URL = LOCAL_URL;

console.log('Using API URL:', BASE_URL, __DEV__ ? '(LOCAL)' : '(PRODUCTION)');


export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {'Content-Type': 'application/json'}
})