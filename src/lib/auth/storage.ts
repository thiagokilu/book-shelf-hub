import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

function isServer() {
  return Platform.OS === "web" && typeof window === "undefined";
}

export async function saveTokens(accessToken: string, refreshToken: string) {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export async function getAccessToken() {
  if (isServer()) return null;

  return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken() {
  if (isServer()) return null;

  return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function clearTokens() {
  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
}
