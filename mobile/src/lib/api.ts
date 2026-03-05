import axios from 'axios';
import { API_BASE_URL } from './config';
import { getToken } from './authToken';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function toErrorMessage(e: unknown, fallback: string) {
  const anyErr = e as any;
  return anyErr?.response?.data?.message ?? anyErr?.message ?? fallback;
}
