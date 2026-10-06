import type { Book } from "@/lib/models/book";
import { z } from 'zod';
import { transformApiBookToBook } from "../../../lib/utils/bookTransformer";
import { clearTokens, getAccessToken } from "../../auth/storage";
import { api } from "../api";

const bookshelfResponseSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
  books: z.array(z.any()).optional(),
  bookshelf: z.array(z.any()).optional(),
  data: z.any().optional(),
});

export const showBookShelf = async () => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  const response = await api.get("/show-book-shelf", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = bookshelfResponseSchema.parse(response.data);

  if (response.status < 200 || response.status >= 300) {
    if (response.status === 401) {
      // Não fazer logout se o erro for email não verificado
      if (
        data.message === "E-mail não verificado" ||
        data.message === "Email not verified" ||
        data.error === "Email not verified"
      ) {
        throw new Error("Email not verified");
      }
      await clearTokens();
      throw new Error("Session expired");
    }

    throw new Error(data.message || data.error || "Could not load bookshelf");
  }

  const rawBooks = Array.isArray(data)
    ? data
    : data.books || data.bookshelf || data.data?.books || data.data || [];

  const books: Book[] = (Array.isArray(rawBooks) ? rawBooks : []).map(transformApiBookToBook);

  return {
    ok: response.status >= 200 && response.status < 300,
    data: books,
  };
};
