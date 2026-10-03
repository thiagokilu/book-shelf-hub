import { getAccessToken } from "../../auth/storage";
import { api } from "../api";

export const getUserProfile = async () => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  const response = await api.get("/me", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return {
    ok: response.status >= 200 && response.status < 300,
    data: response.data,
  };
};
