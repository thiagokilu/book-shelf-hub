import { api } from "../api";

export const searchBooks = async (query: string) => {
  const response = await api.get("/books/search", {
    params: { query },
    headers: { Accept: "application/json" },
  });

  const data = response.data;

  // Transform API response to match Book model format
  const books =
    data.books?.map((doc: any) => ({
      id: doc.id,
      key: doc.id,
      title: doc.title,
      authors: doc.authors || [],
      author: doc.authors?.[0] || "Unknown Author",
      cover: doc.coverUrl,
      coverUrl: doc.coverUrl,
      summary: doc.description || "",
      description: doc.description || "",
      pages: doc.pageCount || 0,
      pageCount: doc.pageCount || 0,
      currentPage: 0,
      publisher: doc.publisher || "",
      language: doc.language || "",
      publishDate: doc.publishedDate || "",
      publishedDate: doc.publishedDate || "",
      publishedYear: doc.publishedYear,
      categories: doc.categories || [],
      isbn: doc.isbn || "",
      infoLink: doc.infoLink || "",
      status: "WANT_TO_READ",
      readingPercentage: 0,
    })) || [];

  return {
    ok: response.status >= 200 && response.status < 300,
    data: books,
  };
};
