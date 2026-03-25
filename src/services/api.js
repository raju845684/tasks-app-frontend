import axios from "axios";

const API = axios.create({
  baseURL: "https://tasks-app-backend-liart.vercel.app/api",
});

// Attach token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
