import axios from "axios";

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: () => true,
});

export const apiUrl = (path: string) => {
  if (!apiBaseUrl) {
    throw new Error("EXPO_PUBLIC_API_URL is not configured");
  }

  return `${apiBaseUrl}${path}`;
};
