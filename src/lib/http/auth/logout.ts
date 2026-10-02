export const logout = async () => {
  const response = await fetch("https://api-books-en6a.onrender.com/sign-out", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const data = await response.json();
  return {
    ok: response.ok,
    data,
  };
};
