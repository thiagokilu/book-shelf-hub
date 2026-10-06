import { z } from 'zod';
import { getAccessToken } from "../../auth/storage";
import { api } from "../api";

const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  authors: z.array(z.string()),
  coverUrl: z.string().optional(),
  description: z.string().optional(),
  publisher: z.string().optional(),
  language: z.string().optional(),
  publishedDate: z.string().optional(),
  publishedYear: z.number().optional(),
  categories: z.array(z.string()).optional(),
  isbn: z.string().optional(),
  infoLink: z.string().optional(),
  pageCount: z.number().optional(),
  status: z.string(),
  currentPage: z.number().optional(),
  totalPages: z.number().optional(),
  readingPercentage: z.number(),
});

const getUserReadingResponseSchema = z.object({
  user: z.object({
    name: z.string(),
    username: z.string(),
    bio: z.string().nullable(),
  }),
  books: z.array(bookSchema),
  message: z.string().optional(),
  error: z.string().optional(),
});

export const getUserReading = async (username: string) => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  const response = await api.get(
    `/users/${encodeURIComponent(username)}/reading`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = getUserReadingResponseSchema.parse(response.data);

  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      data.message || data.error || "Could not load user profile",
    );
  }

  return data;
};
