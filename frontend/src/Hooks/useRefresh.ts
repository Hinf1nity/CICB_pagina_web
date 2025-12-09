import api from '../api/kyClient';
import { logout } from "./useLogin";

const getAccess = () => localStorage.getItem("access");
const getRefresh = () => localStorage.getItem("refresh");

const refreshToken = async () => {
  const refresh = getRefresh();
  if (!refresh) return logout();

  const formData = new FormData();
  formData.append("refresh", refresh);

  try {
    const res = await api
      .post(`token/refresh/`, {
        body: formData, // 👈 refresco usando FormData
      })
      .json<{ access: string }>();

    localStorage.setItem("access", res.access);
    return res.access;
  } catch {
    logout(); // 👈 Si no puede refrescar → cerrar sesión
  }
};

export const res = api.create({
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getAccess();
        if (token) request.headers.set("Authorization", `Bearer ${token}`);
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          const newToken = await refreshToken();
          if (!newToken) return;

          return api(request.url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        }
      },
    ],
  },
});
