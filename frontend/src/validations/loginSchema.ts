import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, { message: "El carnet del usuario debe tener al menos 3 caracteres" }).max(50),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }).max(100),
});

export type LoginData = z.infer<typeof loginSchema>;