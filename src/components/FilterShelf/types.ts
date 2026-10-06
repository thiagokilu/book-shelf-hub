import type { BookFormat, Status } from "@/lib/models/book";

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
