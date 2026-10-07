import type { Book } from "@/lib/models/book";
import { z } from "zod";

export const apiBookSchema = z.object({
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

export type ApiBook = z.infer<typeof apiBookSchema>;

export function transformApiBookToBook(input: unknown): Book {
  const doc: ApiBook = apiBookSchema.parse(input);

  return {
    id: doc.id,
    title: doc.title,
    authors: doc.authors || [],
    author: doc.authors?.[0] || doc.author || "Unknown Author",
    subtitle: doc.subtitle,
    coverUrl: doc.coverUrl || doc.cover || "",
    cover: doc.coverUrl || doc.cover || "",
    description: doc.description || doc.summary,
    summary: doc.description || doc.summary || "",
    publisher: doc.publisher || "",
    language: doc.language || "",
    publishedDate: doc.publishedDate || doc.publishDate || "",
    publishDate: doc.publishedDate || doc.publishDate || "",
    publishedYear: doc.publishedYear,
    categories: doc.categories,
    isbn: doc.isbn,
    infoLink: doc.infoLink,
    pageCount: doc.pageCount || doc.totalPages || doc.pages,
    pages: doc.pageCount || doc.totalPages || doc.pages || 0,
    totalPages: doc.totalPages || doc.pageCount || doc.pages,
    currentPage: doc.currentPage ?? 0,
    status: doc.status || "WANT_TO_READ",
    readingPercentage: doc.readingPercentage ?? doc.progress ?? 0,
    progress: doc.readingPercentage ?? doc.progress ?? 0,
    updatedAt: doc.updatedAt || doc.updated_at || new Date(),
    updated_at:
      doc.updatedAt instanceof Date
        ? doc.updatedAt.toISOString()
        : doc.updatedAt || doc.updated_at,
    tags: doc.tags || [],
    format: doc.format || "PHYSICAL",
  };
}
