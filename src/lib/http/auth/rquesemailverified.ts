import { z } from 'zod';
import { getAccessToken } from "../../auth/storage";
import { api } from "../api";

const requestEmailVerifiedResponseSchema = z.object({
  message: z.string().optional(),
});

export const RequestEmailVerified = async () => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  const response = await api.post(
    "/request-email-verified",
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = requestEmailVerifiedResponseSchema.parse(response.data);
  return {
    ok: response.status >= 200 && response.status < 300,
    data,
  };
};
