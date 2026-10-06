import { z } from 'zod';
import { getAccessToken } from "../../auth/storage";
import { api } from "../api";

const getUserProfileResponseSchema = z.object({
  message: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    username: z.string(),
    email: z.string(),
    bio: z.string().nullable().optional(),
    profileImageUrl: z.string().nullable().optional(),
    emailVerified: z.boolean().optional(),
  }),
});

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

  const data = getUserProfileResponseSchema.parse(response.data);
  return {
    ok: response.status >= 200 && response.status < 300,
    data: data.user,
  };
};
