import ky from "ky";
import { logout } from "../hooks/useLogin";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/`;
// const API_URL = "http://127.0.0.1:8000/api/";

const getAccess = () => localStorage.getItem("access");
const getRefresh = () => localStorage.getItem("refresh");

const refreshToken = async () => {
  const refresh = getRefresh();
  if (!refresh) return logout();

  const formData = new FormData();
  formData.append("refresh", refresh);

  try {
    const res = await ky
      .post(`${API_URL}token/refresh/`, {
        body: formData, // 👈 refresco usando FormData
      })
      .json<{ access: string }>();

    localStorage.setItem("access", res.access);
    return res.access;
  } catch {
    logout(); // 👈 Si no puede refrescar → cerrar sesión
  }
};

const api = ky.create({
  prefixUrl: API_URL,
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

          return ky(request.url, {
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

export default api;