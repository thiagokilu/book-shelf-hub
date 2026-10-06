import { z } from 'zod';
import { api } from "../api";

const loginResponseEschema = z.object({
  accessToken: z.string().optional(),
  access_token: z.string().optional(),
  token: z.string().optional(),
  refreshToken: z.string().optional(),
  refresh_token: z.string().optional(),
})

export const login = async (email: string, password: string) => {
  const response = await api.post("/sign-in", { email, password });

  const data = loginResponseEschema.parse(response.data);

  return {
    ok: response.status >= 200 && response.status < 300,
    data: {
      ...data,
      accessToken: data.accessToken || data.access_token || data.token,
      refreshToken: data.refreshToken || data.refresh_token,
    },
  };
};
