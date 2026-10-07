import axios from "axios";
import { z } from "zod";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "../../auth/storage";
import { apiUrl } from "../api";

const refreshResponseSchema = z.object({
  accessToken: z.string().optional(),
  access_token: z.string().optional(),
  token: z.string().optional(),
  refreshToken: z.string().optional(),
  refresh_token: z.string().optional(),
});

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

  const response = await axios.post(apiUrl("/refresh-token"), {
    refreshToken: refresh,
  });
  const data = refreshResponseSchema.parse(response.data);
  const accessToken = data.accessToken || data.access_token || data.token;
  const refreshToken = data.refreshToken || data.refresh_token;

  if (!accessToken || !refreshToken) {
    throw new Error("Invalid refresh token response");
  }

  await saveTokens(accessToken, refreshToken);

  return accessToken;
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
