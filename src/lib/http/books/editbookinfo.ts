import { z } from 'zod';
import { getAccessToken } from "../../auth/storage";
import { api } from "../api";

const editBookInfoRequestSchema = z.object({
  id: z.string(),
  readingStatus: z.enum(["WANT_TO_READ", "READING", "COMPLETED"]),
  currentPage: z.number(),
});

const editBookInfoResponseSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
});

export const editBookInfo = async (
  bookId: string,
  readingStatus: "WANT_TO_READ" | "READING" | "COMPLETED",
  currentPage: number,
) => {
  const validatedRequest = editBookInfoRequestSchema.parse({
    id: bookId,
    readingStatus,
    currentPage,
  });
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  const response = await api.put(
    "/edit-book-reading-status",
    validatedRequest,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = editBookInfoResponseSchema.parse(response.data || {});
  const ok = response.status >= 200 && response.status < 300;

  if (!ok) {
    const message = data.message || data.error;
    throw new Error(
      typeof message === "string" ? message : "Could not edit book",
    );
  }

  return {
    ok,
    data,
  };
};
