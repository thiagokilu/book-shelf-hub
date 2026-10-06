import { z } from 'zod';
import { api } from "../api";

const refreshTokenResponseSchema = z.object({
  accessToken: z.string().optional(),
  access_token: z.string().optional(),
  token: z.string().optional(),
  refreshToken: z.string().optional(),
  refresh_token: z.string().optional(),
});

export const refreshToken = async () => {
  const response = await api.post("/refresh-token", {});

  const data = refreshTokenResponseSchema.parse(response.data);
  return {
    ok: response.status >= 200 && response.status < 300,
    data: {
      ...data,
      accessToken: data.accessToken || data.access_token || data.token,
      refreshToken: data.refreshToken || data.refresh_token,
    },
  };
};
