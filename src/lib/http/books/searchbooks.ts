import { z } from 'zod';
import { api } from "../api";

const searchBooksResponseSchema = z.object({
  books: z.array(z.object({
    id: z.string(),
    title: z.string(),
    authors: z.array(z.string()).optional(),
    coverUrl: z.string().optional(),
    description: z.string().optional(),
    pageCount: z.number().optional(),
    publisher: z.string().optional(),
    language: z.string().optional(),
    publishedDate: z.string().optional(),
    publishedYear: z.number().optional(),
    categories: z.array(z.string()).optional(),
    isbn: z.string().optional(),
    infoLink: z.string().optional(),
  })).optional(),
});

export const PAGE_SIZE = 20;

export const searchBooks = async (query: string, page: number = 1) => {
  const response = await api.get("/books/search", {
    params: { query, page, limit: PAGE_SIZE },
    headers: { Accept: "application/json" },
  });

  const data = searchBooksResponseSchema.parse(response.data);

  // Transform API response to match Book model format
  const books =
    data.books?.map((doc) => ({
      id: doc.id,
      key: doc.id,
      title: doc.title,
      authors: doc.authors || [],
      author: doc.authors?.[0] || "Unknown Author",
      cover: doc.coverUrl,
      coverUrl: doc.coverUrl,
      summary: doc.description || "",
      description: doc.description || "",
      pages: doc.pageCount || 0,
      pageCount: doc.pageCount || 0,
      currentPage: 0,
      publisher: doc.publisher || "",
      language: doc.language || "",
      publishDate: doc.publishedDate || "",
      publishedDate: doc.publishedDate || "",
      publishedYear: doc.publishedYear,
      categories: doc.categories || [],
      isbn: doc.isbn || "",
      infoLink: doc.infoLink || "",
      status: "WANT_TO_READ" as const,
      readingPercentage: 0,
    })) || [];

  return {
    ok: response.status >= 200 && response.status < 300,
    data: books,
  };
};
