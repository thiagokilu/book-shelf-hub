import type { Book } from "@/lib/models/book";
import { z } from 'zod';
import { transformApiBookToBook } from "../../../lib/utils/bookTransformer";
import { clearTokens, getAccessToken } from "../../auth/storage";
import { api } from "../api";

const apiBookSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  authors: z.array(z.string()).optional(),
  author: z.string().optional(),
  coverUrl: z.string().optional(),
  cover: z.string().optional(),
  description: z.string().optional(),
  summary: z.string().optional(),
  publisher: z.string().optional(),
  language: z.string().optional(),
  publishedDate: z.string().optional(),
  publishDate: z.string().optional(),
  publishedYear: z.number().optional(),
  categories: z.array(z.string()).optional(),
  isbn: z.string().optional(),
  infoLink: z.string().optional(),
  pageCount: z.number().optional(),
  pages: z.number().optional(),
  totalPages: z.number().optional(),
  currentPage: z.number().optional(),
  status: z.enum(["WANT_TO_READ", "READING", "COMPLETED", "ALL"]).optional(),
  readingPercentage: z.number().optional(),
  progress: z.number().optional(),
  updatedAt: z.string().or(z.date()).optional(),
  updated_at: z.string().optional(),
  tags: z.array(z.string()).optional(),
  format: z.enum(["EBOOK", "PHYSICAL", "AUDIOBOOK"]).optional(),
});

const bookshelfResponseSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
  books: z.array(apiBookSchema).optional(),
  bookshelf: z.array(apiBookSchema).optional(),
  data: z.union([
    z.array(apiBookSchema),
    z.object({ books: z.array(apiBookSchema).optional() }),
  ]).optional(),
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
    : data.books || data.bookshelf || (typeof data.data === 'object' && data.data !== null && 'books' in data.data ? data.data.books : data.data) || [];

  const books: Book[] = (Array.isArray(rawBooks) ? rawBooks : []).map(transformApiBookToBook);

  return {
    ok: response.status >= 200 && response.status < 300,
    data: books,
  };
};
