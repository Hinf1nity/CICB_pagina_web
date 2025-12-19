import api from '../api/kyClient';
import { type LoginData } from '../validations/loginSchema';

type LoginResponse = {
  access: string;
  refresh: string;
};

export function useLogin() {
  const login = async (data: LoginData) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    const response = await api.post('token/', { body: formData }).json<LoginResponse>();
    localStorage.setItem('access', response.access);
    localStorage.setItem('refresh', response.refresh);
    return response;
  };
  return { login };
}

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.location.href = "/login";
};