import api from "./kyClient";

export const authService = {
  async login(username: string, password: string) {
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);

    return api
      .post('token/', { body: form })
      .json<{ access: string; refresh: string }>();
  },
};