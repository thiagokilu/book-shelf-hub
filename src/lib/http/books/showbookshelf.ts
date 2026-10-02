import type { MockBook } from "../../../../mock/books";
import { clearTokens, getAccessToken } from "../../auth/storage";

export const showBookShelf = async () => {
  const accessToken = await getAccessToken();
  console.log("Bookshelf - Access token:", accessToken ? "exists" : "missing");
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  console.log("Bookshelf - Fetching from API...");
  const response = await fetch(
    `https://api-books-en6a.onrender.com/show-book-shelf`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  console.log("Bookshelf - Response status:", response.status);
  const data = await response.json();
  console.log("Bookshelf - Response data:", data);

  if (!response.ok) {
    if (response.status === 401) {
      // Não fazer logout se o erro for email não verificado
      if (data.message === "E-mail não verificado" || data.error === "Unauthorized") {
        throw new Error("Email not verified");
      }
      await clearTokens();
      throw new Error("Session expired");
    }

    throw new Error(data.message || data.error || "Could not load bookshelf");
  }

  const rawBooks = Array.isArray(data)
    ? data
    : data.books || data.bookshelf || data.data?.books || data.data || [];

  // Transform API response to match expected format
  const books: MockBook[] = (Array.isArray(rawBooks) ? rawBooks : []).map(
    (doc: any) => ({
      id: doc.id,
      title: doc.title,
      authors: doc.authors || [],
      author: doc.authors?.[0] || "Unknown Author",
      subtitle: doc.subtitle || "",
      cover: doc.coverUrl,
      summary: doc.description || "",
      pages: doc.totalPages ?? doc.pageCount ?? 0,
      currentPage: doc.currentPage ?? 0,
      publisher: doc.publisher || "",
      language: doc.language || "",
      publishDate: doc.publishedDate || "",
      publishedYear: doc.publishedYear,
      categories: doc.categories || [],
      isbn: doc.isbn || "",
      infoLink: doc.infoLink || "",
      status: doc.status || "WANT_TO_READ",
      progress: doc.readingPercentage ?? doc.progress ?? 0,
      readingPercentage: doc.readingPercentage ?? doc.progress ?? 0,
      totalPages: doc.totalPages ?? doc.pageCount ?? 0,
      updatedAt: doc.updatedAt || doc.updated_at || "",
      tags: doc.tags || [],
      format: doc.format || "PHYSICAL",
    }),
  );

  return {
    ok: response.ok,
    data: books,
  };
};
