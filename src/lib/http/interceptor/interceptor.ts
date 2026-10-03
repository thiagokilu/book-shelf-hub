import axios from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "../../auth/storage";
import { apiUrl } from "../api";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let refreshPromise: Promise<string> | null = null;

export async function doRefresh() {
  const refresh = await getRefreshToken();

  if (!refresh) {
    throw new Error("Refresh token not found");
  }

  const { data } = await axios.post(apiUrl("/refresh-token"), {
    refreshToken: refresh,
  });

  await saveTokens(data.accessToken, data.refreshToken);

  return data.accessToken;
}

// 2. Trata o 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true; // evita loop infinito

      try {
        refreshPromise ??= doRefresh().finally(() => {
          refreshPromise = null;
        });

        const newToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original); // refaz a requisição
      } catch (e) {
        await clearTokens();
        // aqui: navegar para a tela de login / disparar logout
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  },
);
