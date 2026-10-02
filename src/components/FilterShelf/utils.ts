import type { Book, ShelfFilters, SortKey } from "./types";

const time = (d: string | Date) => new Date(d).getTime();

const SORTERS: Record<SortKey, (a: Book, b: Book) => number> = {
    LAST_READ: (a, b) => time(b.updatedAt) - time(a.updatedAt),
    PROGRESS_DESC: (a, b) => b.progress - a.progress,
    PROGRESS_ASC: (a, b) => a.progress - b.progress,
    PAGES_ASC: (a, b) => a.pages - b.pages,
    PAGES_DESC: (a, b) => b.pages - a.pages,
};

/** Aplica filtros e ordenação a uma lista de livros. */
export function applyShelfFilters<T extends Book>(books: T[], f: ShelfFilters): T[] {
    return books
        .filter((b) => f.status === "ALL" || b.status === f.status)
        .filter((b) => f.tag === "ALL" || b.tags.includes(f.tag))
        .filter((b) => f.format === "ALL" || b.format === f.format)
        .sort(SORTERS[f.sort]);
}
