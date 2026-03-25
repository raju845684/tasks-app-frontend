import axios from "axios";

const API = axios.create({
  baseURL: "https://tasks-app-backend-liart.vercel.app/api",
});

export default API;