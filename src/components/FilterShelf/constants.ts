import type { BookFormat, SortKey, Status } from "./types";

export const STATUS_OPTIONS: { label: string; value: Status; key: string }[] = [
  { label: "", value: "ALL", key: "ALL" },
  { label: "", value: "WANT_TO_READ", key: "WANT_TO_READ" },
  { label: "", value: "READING", key: "READING" },
  { label: "", value: "COMPLETED", key: "COMPLETED" },
];

export const FORMAT_OPTIONS: {
  label: string;
  value: BookFormat | "ALL";
  key: string;
}[] = [
  { label: "", value: "ALL", key: "ALL" },
  { label: "", value: "EBOOK", key: "EBOOK" },
  { label: "", value: "PHYSICAL", key: "PHYSICAL" },
  { label: "", value: "AUDIOBOOK", key: "AUDIOBOOK" },
];

export const SORT_OPTIONS: { label: string; value: SortKey; key: string }[] = [
  { label: "", value: "LAST_READ", key: "LAST_READ" },
  { label: "", value: "PROGRESS_DESC", key: "PROGRESS_DESC" },
  { label: "", value: "PROGRESS_ASC", key: "PROGRESS_ASC" },
  { label: "", value: "PAGES_ASC", key: "PAGES_ASC" },
  { label: "", value: "PAGES_DESC", key: "PAGES_DESC" },
];
