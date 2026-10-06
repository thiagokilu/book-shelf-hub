import { z } from 'zod';
import { api } from "../api";

const logoutResponseESchema = z.object({
  message: z.string(),
})

export const logout = async () => {
  const response = await api.post("/sign-out", {});

  const data = logoutResponseESchema.parse(response.data);
  return {
    ok: response.status >= 200 && response.status < 300,
    data,
  };
};
