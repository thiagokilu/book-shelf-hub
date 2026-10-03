import { getAccessToken } from "../../auth/storage";
import { api } from "../api";

export const SearchUsers = async (username: string) => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  const response = await api.get(
    `/search-users/${encodeURIComponent(username)}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = response.data;

  return {
    ok: response.status >= 200 && response.status < 300,
    data,
  };
};
