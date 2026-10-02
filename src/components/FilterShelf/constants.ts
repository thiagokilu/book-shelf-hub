import type { BookFormat, SortKey, Status } from "./types";

export const STATUS_OPTIONS: { label: string; value: Status; key: string }[] = [
    { label: "Todos", value: "ALL", key: "ALL" },
    { label: "Quero ler", value: "WANT_TO_READ", key: "WANT_TO_READ" },
    { label: "Lendo", value: "READING", key: "READING" },
    { label: "Concluído", value: "COMPLETED", key: "COMPLETED" },
];

export const FORMAT_OPTIONS: { label: string; value: BookFormat | "ALL"; key: string }[] = [
    { label: "Todos", value: "ALL", key: "ALL" },
    { label: "Ebook", value: "EBOOK", key: "EBOOK" },
    { label: "Livro físico", value: "PHYSICAL", key: "PHYSICAL" },
    { label: "Audiobook", value: "AUDIOBOOK", key: "AUDIOBOOK" },
];

export const SORT_OPTIONS: { label: string; value: SortKey; key: string }[] = [
    { label: "Última leitura", value: "LAST_READ", key: "LAST_READ" },
    { label: "Progresso: maior", value: "PROGRESS_DESC", key: "PROGRESS_DESC" },
    { label: "Progresso: menor", value: "PROGRESS_ASC", key: "PROGRESS_ASC" },
    { label: "Páginas: menor", value: "PAGES_ASC", key: "PAGES_ASC" },
    { label: "Páginas: maior", value: "PAGES_DESC", key: "PAGES_DESC" },
];
