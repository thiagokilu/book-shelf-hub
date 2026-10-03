import { getAccessToken } from "../../auth/storage";
import { api } from "../api";

export const getUserReading = async (username: string) => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  const response = await api.get(
    `/users/${encodeURIComponent(username)}/reading`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = response.data;

  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      data.message || data.error || "Could not load user profile",
    );
  }

  return data as {
    user: {
      name: string;
      username: string;
      bio: string | null;
    };
    books: Array<{
      id: string;
      title: string;
      subtitle?: string;
      authors: string[];
      coverUrl?: string;
      description?: string;
      publisher?: string;
      language?: string;
      publishedDate?: string;
      publishedYear?: number;
      categories?: string[];
      isbn?: string;
      infoLink?: string;
      pageCount?: number;
      status: string;
      currentPage?: number;
      totalPages?: number;
      readingPercentage: number;
    }>;
  };
};
