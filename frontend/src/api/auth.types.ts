import type { Role } from "./auth.roles";

export interface User {
  id: number;
  rol: Role;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (username: string, password: string) => Promise<void>;
  logout: () => void;

  hasPermission: (permission: string) => boolean;

  updateUser: (newUser: string | undefined) => void;
}
