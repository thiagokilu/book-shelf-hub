import { z } from 'zod';
import { api } from "../api";

const signUpRequestSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  bio: z.string(),
});

const signUpResponseSchema = z.object({
  message: z.string().optional(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    username: z.string(),
    email: z.string(),
    bio: z.string(),
  }).optional(),
  accessToken: z.string().optional(),
  access_token: z.string().optional(),
  token: z.string().optional(),
  refreshToken: z.string().optional(),
  refresh_token: z.string().optional(),
});

export const signUp = async (request: z.infer<typeof signUpRequestSchema>) => {
  const validatedRequest = signUpRequestSchema.parse(request);
  const response = await api.post("/sign-up", validatedRequest);

  const data = signUpResponseSchema.parse(response.data);
  const ok = response.status >= 200 && response.status < 300;

  if (!ok) {
    throw new Error(data.message || "Erro ao criar conta");
  }

  return {
    ok,
    data: {
      ...data,
      accessToken: data.accessToken || data.access_token || data.token,
      refreshToken: data.refreshToken || data.refresh_token,
    },
  };
};
