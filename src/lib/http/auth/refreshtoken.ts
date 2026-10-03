import { api } from "../api";

export const refreshToken = async () => {
  const response = await api.post("/refresh-token", {});

  const data = response.data;
  return {
    ok: response.status >= 200 && response.status < 300,
    data: {
      ...data,
      accessToken: data.accessToken || data.access_token || data.token,
      refreshToken: data.refreshToken || data.refresh_token,
    },
  };
};
