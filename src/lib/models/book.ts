export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  coverUrl?: string;
  description?: string;
  publisher?: string;
  language?: string;
  publishedDate?: string;
  publishedYear?: number;
  categories?: string[];
  isbn?: string;
  infoLink?: string;
  pageCount?: number;
  currentPage?: number;
  status?: "WANT_TO_READ" | "READING" | "COMPLETED";
  readingPercentage?: number;
  updatedAt?: string | Date;
  tags?: string[];
  format?: "EBOOK" | "PHYSICAL" | "AUDIOBOOK";
}
