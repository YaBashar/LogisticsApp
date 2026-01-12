import axios from 'axios'
const BASE_URL = __DEV__ 
  ? "http://192.168.0.49:3299"  // Local development
  : "https://logisticsapp-uldj.onrender.com";  // Production (Render backend)

console.log('Using API URL:', BASE_URL); 

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {'Content-Type': 'application/json'}
})