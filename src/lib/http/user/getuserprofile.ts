import { getAccessToken } from "../../auth/storage";

export const getUserProfile = async () => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access token not found");
  }
  
  const response = await fetch("https://api-books-en6a.onrender.com/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({}),
  });
  const data = await response.json();
  return {
    ok: response.ok,
    data,
  };
};
