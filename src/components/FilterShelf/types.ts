export type Status = "WANT_TO_READ" | "READING" | "COMPLETED" | "ALL";
export type BookFormat = "EBOOK" | "PHYSICAL" | "AUDIOBOOK";

export type Book = {
  id: string;
  title: string;
  status: Status;
  progress: number; // 0 a 100
  updatedAt: string | Date; // última leitura
  pages: number;
  tags: string[]; // ex.: "Técnico", "Ficção", "Produtividade"
  format: BookFormat;
  publisher: string;
  publishDate: string;
  language: string;
  summary: string;
  authors?: string[];
  subtitle?: string;
  categories?: string[];
  isbn?: string;
  infoLink?: string;
  publishedYear?: number;
  readingPercentage?: number;
};

export type SortKey =
  "LAST_READ" | "PROGRESS_DESC" | "PROGRESS_ASC" | "PAGES_ASC" | "PAGES_DESC";

export type ShelfFilters = {
  status: Status;
  sort: SortKey;
  tag: string; // "ALL" = sem filtro
  format: BookFormat | "ALL";
};

export const DEFAULT_FILTERS: ShelfFilters = {
  status: "ALL",
  sort: "LAST_READ",
  tag: "ALL",
  format: "ALL",
};
