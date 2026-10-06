export type Status = "WANT_TO_READ" | "READING" | "COMPLETED" | "ALL";
export type BookFormat = "EBOOK" | "PHYSICAL" | "AUDIOBOOK";

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  author?: string;
  coverUrl?: string;
  cover?: string;
  description?: string;
  summary?: string;
  publisher?: string;
  language?: string;
  publishedDate?: string;
  publishDate?: string;
  publishedYear?: number;
  categories?: string[];
  isbn?: string;
  infoLink?: string;
  pageCount?: number;
  pages?: number;
  totalPages?: number;
  currentPage?: number;
  status?: Status;
  readingPercentage?: number;
  progress?: number;
  updatedAt?: string | Date;
  updated_at?: string;
  tags?: string[];
  format?: BookFormat;
}
