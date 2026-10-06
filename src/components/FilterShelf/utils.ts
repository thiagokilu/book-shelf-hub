import type { Book } from "@/lib/models/book";
import type { ShelfFilters, SortKey } from "./types";

const time = (d: string | Date) => new Date(d).getTime();

const SORTERS: Record<SortKey, (a: Book, b: Book) => number> = {
    LAST_READ: (a, b) => time(b.updatedAt || new Date()) - time(a.updatedAt || new Date()),
    PROGRESS_DESC: (a, b) => (b.progress || 0) - (a.progress || 0),
    PROGRESS_ASC: (a, b) => (a.progress || 0) - (b.progress || 0),
    PAGES_ASC: (a, b) => (a.pages || 0) - (b.pages || 0),
    PAGES_DESC: (a, b) => (b.pages || 0) - (a.pages || 0),
};

/** Aplica filtros e ordenação a uma lista de livros. */
export function applyShelfFilters<T extends Book>(books: T[], f: ShelfFilters): T[] {
    return books
        .filter((b) => f.status === "ALL" || b.status === f.status)
        .filter((b) => f.tag === "ALL" || (b.tags && b.tags.includes(f.tag)))
        .filter((b) => f.format === "ALL" || b.format === f.format)
        .sort(SORTERS[f.sort]);
}
