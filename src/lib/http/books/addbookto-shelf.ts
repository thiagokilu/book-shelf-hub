import { z } from 'zod';
import { getAccessToken } from "../../auth/storage";
import { Book } from "../../models/book";
import { api } from "../api";

const addBookToShelfRequestSchema = z.object({
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

const addBookToShelfResponseSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
});

export const AddBookToShelf = async (book: Book) => {
  const validatedBook = addBookToShelfRequestSchema.parse(book);
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  const response = await api.post("/add-book-shelf", validatedBook, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = addBookToShelfResponseSchema.parse(response.data || {});

  const ok = response.status >= 200 && response.status < 300;

  if (!ok) {
    const message = data.message || data.error;
    throw new Error(
      typeof message === "string" ? message : "Could not add book to shelf",
    );
  }

  return {
    ok,
    data,
  };
};
