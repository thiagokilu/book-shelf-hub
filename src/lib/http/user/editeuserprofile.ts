import { getAccessToken } from "../../auth/storage";
import { api } from "../api";

interface EditUserProfileRequest {
  name?: string;
  username?: string;
  bio?: string;
  profileImageUrl?: string | null;
}

export const editUserProfile = async (request: EditUserProfileRequest) => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  const response = await api.patch("/edit", request, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: Record<string, unknown> = response.data || {};
  const ok = response.status >= 200 && response.status < 300;

  if (!ok) {
    const message = data.message || data.error;
    throw new Error(
      typeof message === "string" ? message : "Could not edit user profile",
    );
  }

  return {
    ok,
  };
};
