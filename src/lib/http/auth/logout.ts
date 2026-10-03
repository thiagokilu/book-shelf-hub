import { api } from "../api";

export const logout = async () => {
  const response = await api.post("/sign-out", {});

  const data = response.data;
  return {
    ok: response.status >= 200 && response.status < 300,
    data,
  };
};
