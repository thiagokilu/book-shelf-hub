import { api } from "../api";

interface signUpRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  bio: string;
}

export const signUp = async (request: signUpRequest) => {
  const response = await api.post("/sign-up", request);

  const data = response.data;
  const ok = response.status >= 200 && response.status < 300;

  if (!ok) {
    throw new Error(data.message || "Erro ao criar conta");
  }

  return {
    ok,
    data,
  };
};
