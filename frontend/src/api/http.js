// api/http.js
import axios from "axios";
import { getToken } from "./tokenStore";

export const http = axios.create({
  baseURL: "http://localhost:3000",
});

http.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
