export const searchBooks = async (query: string) => {
  const response = await fetch(
    `https://api-books-en6a.onrender.com/books/search?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();

  // Transform API response to match expected format
  const books = data.books?.map((doc: any) => ({
    id: doc.id,
    key: doc.id,
    title: doc.title,
    author: doc.authors?.[0] || "Unknown Author",
    cover: doc.coverUrl,
    summary: doc.description || "",
    pages: doc.pageCount || 0,
    currentPage: 0,
    publisher: doc.publisher || "",
    language: doc.language || "",
    publishDate: doc.publishedDate || "",
    status: "WANT_TO_READ",
  })) || [];

  return {
    ok: response.ok,
    data: books,
  };
};
