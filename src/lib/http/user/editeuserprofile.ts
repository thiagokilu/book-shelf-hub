import { z } from 'zod';
import { getAccessToken } from "../../auth/storage";
import { api } from "../api";

const editUserProfileRequestSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  bio: z.string().optional(),
  profileImageUrl: z.string().nullable().optional(),
});

const editUserProfileResponseSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
});

export const editUserProfile = async (request: z.infer<typeof editUserProfileRequestSchema>) => {
  const validatedRequest = editUserProfileRequestSchema.parse(request);
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  const response = await api.patch("/edit", validatedRequest, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = editUserProfileResponseSchema.parse(response.data || {});
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
