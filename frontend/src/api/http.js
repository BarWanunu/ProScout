// src/api/http.js
import axios from "axios";
import { getToken, clearToken } from "./tokenStore";

export const http = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      clearToken();
    }
    return Promise.reject(err);
  }
);

export function toFormData(obj = {}) {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) v.forEach((val) => fd.append(k, val));
    else fd.append(k, v);
  });
  return fd;
}
