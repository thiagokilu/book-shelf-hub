import { z } from 'zod';
import { getAccessToken } from "../../auth/storage";
import { Book } from "../../models/book";
import { api } from "../api";

const addBookToShelfResponseSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
});

export const AddBookToShelf = async (book: Book) => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  const response = await api.post("/add-book-shelf", book, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = addBookToShelfResponseSchema.parse(response.data || {});

  const ok = response.status >= 200 && response.status < 300;

  if (!ok) {
    const message = data.message || data.error;
    throw new Error(
      typeof message === "string" ? message : "Could not add book to shelf",
    );
  }

  return {
    ok,
    data,
  };
};
