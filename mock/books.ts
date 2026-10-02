import type { Book } from "@/components/FilterShelf/types";

/** Tipo estendido para uso nas telas (inclui campos de exibição). */
export type MockBook = Book & {
  author: string;
  currentPage: number;
  cover: string;
  totalPages?: number;
};

export const MOCK_BOOKS: MockBook[] = [
  {
    id: "1",
    title: "Clean Code",
    author: "Robert C. Martin",
    summary:
      "Clean Code teaches how to write readable, simple, and maintainable code. It covers meaningful names, small functions, clear responsibilities, avoiding duplication, and proper error handling.",
    pages: 431,
    currentPage: 210,
    status: "READING",
    progress: 49,
    updatedAt: "2026-09-20T10:00:00Z",
    tags: ["Técnico", "Programação"],
    format: "PHYSICAL",
    publisher: "Prentice Hall",
    language: "english",
    publishDate: "2008-08-01",
    cover: "https://covers.openlibrary.org/b/id/11311437-L.jpg",
  },
  {
    id: "2",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    summary:
      "A guide to becoming a more effective programmer, covering topics from personal responsibility and career development to architectural techniques for keeping your code flexible and easy to adapt.",
    pages: 352,
    currentPage: 352,
    status: "COMPLETED",
    progress: 100,
    updatedAt: "2026-08-15T08:00:00Z",
    tags: ["Técnico", "Carreira"],
    format: "EBOOK",
    publisher: "Addison-Wesley",
    language: "english",
    publishDate: "1999-10-20",
    cover: "https://covers.openlibrary.org/b/id/10143650-L.jpg",
  },
  {
    id: "3",
    title: "Design Patterns",
    author: "Gang of Four",
    summary:
      "Describes 23 classic software design patterns that provide reusable solutions to commonly occurring problems in software design.",
    pages: 395,
    currentPage: 0,
    status: "WANT_TO_READ",
    progress: 0,
    updatedAt: "2026-07-01T00:00:00Z",
    tags: ["Técnico", "Arquitetura"],
    format: "PHYSICAL",
    publisher: "Addison-Wesley",
    language: "english",
    publishDate: "1994-10-31",
    cover: "https://covers.openlibrary.org/b/id/10827044-M.jpg",
  },
  {
    id: "4",
    title: "Refactoring",
    author: "Martin Fowler",
    summary:
      "Explains how to improve the design of existing code without changing its behavior, using a catalog of over 70 refactoring techniques.",
    pages: 448,
    currentPage: 120,
    status: "READING",
    progress: 27,
    updatedAt: "2026-09-25T14:00:00Z",
    tags: ["Técnico", "Programação"],
    format: "EBOOK",
    publisher: "Addison-Wesley",
    language: "english",
    publishDate: "2018-11-20",
    cover: "https://covers.openlibrary.org/b/id/8507565-L.jpg",
  },
  {
    id: "5",
    title: "You Don't Know JS",
    author: "Kyle Simpson",
    summary:
      "A deep dive into the core mechanisms of JavaScript, covering scope, closures, this, object prototypes, types, and grammar.",
    pages: 278,
    currentPage: 278,
    status: "COMPLETED",
    progress: 100,
    updatedAt: "2026-06-10T09:00:00Z",
    tags: ["Técnico", "JavaScript"],
    format: "EBOOK",
    publisher: "O'Reilly",
    language: "english",
    publishDate: "2015-12-27",
    cover: "https://covers.openlibrary.org/b/id/10527843-L.jpg",
  },
];
