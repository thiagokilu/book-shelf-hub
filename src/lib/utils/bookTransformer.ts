import type { Book } from "@/lib/models/book";

export function transformApiBookToBook(doc: any): Book {
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
    updated_at: doc.updatedAt || doc.updated_at,
    tags: doc.tags || [],
    format: doc.format || "PHYSICAL",
  };
}
