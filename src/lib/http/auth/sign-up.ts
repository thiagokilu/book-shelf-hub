interface signUpRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  bio: string;
}

export const signUp = async (request: signUpRequest) => {
  const response = await fetch("https://api-books-en6a.onrender.com/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao criar conta");
  }

  return {
    ok: response.ok,
    data,
  };
};
