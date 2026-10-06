import { z } from "zod";
import { getAccessToken } from "../../auth/storage";
import { api } from "../api";

const searchUsersResponseSchema = z.object({
  users: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        username: z.string(),
        bio: z.string().nullable().optional(),
        profileImageUrl: z.string().nullable().optional(),
      }),
    )
    .optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

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

  const data = searchUsersResponseSchema.parse(response.data);

  return {
    ok: response.status >= 200 && response.status < 300,
    data,
  };
};
