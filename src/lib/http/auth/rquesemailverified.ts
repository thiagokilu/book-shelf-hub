import { getAccessToken } from "../../auth/storage";

export const RequestEmailVerified = async () => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access token not found");
  }
  
  const response = await fetch("https://api-books-en6a.onrender.com/request-email-verified", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({}),
  });
  return {
    ok: response.ok,
  };
};
