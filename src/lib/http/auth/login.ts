export const login = async (email: string, password: string) => {
  const response = await fetch("https://api-books-en6a.onrender.com/sign-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return {
    ok: response.ok,
    data: {
      ...data,
      accessToken: data.accessToken || data.access_token || data.token,
      refreshToken: data.refreshToken || data.refresh_token,
    },
  };
};
