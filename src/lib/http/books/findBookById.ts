import { z } from 'zod';
import { api } from "../api";

const findBookByIdResponseSchema = z.object({
  book: z.object({
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
  }),
});

    

export const findBookById = async (id: string) => {
  const response = await api.get(`/books/${id}`, {
    headers: { Accept: "application/json" },
  });

  const data = findBookByIdResponseSchema.parse(response.data);

  // Transform API response to match Book model format
  const book = data.book ? {
      id: data.book.id,
      key: data.book.id,
      title: data.book.title,
      authors: data.book.authors || [],
      author: data.book.authors?.[0] || "Unknown Author",
      cover: data.book.coverUrl,
      coverUrl: data.book.coverUrl,
      summary: data.book.description || "",
      description: data.book.description || "",
      pages: data.book.pageCount || 0,
      pageCount: data.book.pageCount || 0,
      currentPage: 0,
      publisher: data.book.publisher || "",
      language: data.book.language || "",
      publishDate: data.book.publishedDate || "",
      publishedDate: data.book.publishedDate || "",
      publishedYear: data.book.publishedYear,
      categories: data.book.categories || [],
      isbn: data.book.isbn || "",
      infoLink: data.book.infoLink || "",
      status: "WANT_TO_READ" as const,
      readingPercentage: 0,
    } : null;

  return {
    ok: response.status >= 200 && response.status < 300,
    data: book,
  };
};
