import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.49:3299";
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