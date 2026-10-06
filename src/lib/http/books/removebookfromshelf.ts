import { z } from 'zod';
import { getAccessToken } from "../../auth/storage";
import { api } from "../api";

const removeBookFromShelfResponseSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
});

export const RemoveBookFromShelf = async (id: string) => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  const response = await api.post(
    "/remove-book-shelf",
    { id },
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = removeBookFromShelfResponseSchema.parse(response.data || {});
  const ok = response.status >= 200 && response.status < 300;
  if (!ok) {
    const message = data.message || data.error;
    throw new Error(
      typeof message === "string"
        ? message
        : "Could not remove book from shelf",
    );
  }

  return {
    ok,
  };
};
