import { z } from "zod";

const roles = ["admin", "moderador", "miembro"];
const departamentos = ["La Paz", "Cochabamba", "Santa Cruz", "Oruro", "Potosí", "Tarija", "Chuquisaca", "Beni", "Pando"];
const especialidades = ["estructural", "hidráulica", "geotecnia", "vial", "ambiental", "construcción", "sanitaria", "transporte"];
const estados = ["activo", "pendiente", "suspendido"];
export const userSchema = z.object({
  nombre: z.string().min(2, { message: "Nombre demasiado corto" }).max(100, { message: "Nombre demasiado largo" }),
  email: z.email().optional(),
  rni: z.string().refine((val) => /^\d{6,10}$/.test(val), { message: "RNI inválido" }),
  rol: z.enum(roles, { message: "Rol inválido" }),
  especialidad: z.enum(especialidades, { message: "Especialidad inválida" }),
  celular: z.string().refine((val) => /^\+?\d{7,15}$/.test(val), { message: "Número de celular inválido" }),
  departamento: z.enum(departamentos, { message: "Departamento inválido" }),
  empleado: z.string().optional(),
  estado: z.enum(estados, { message: "Estado inválido" }),
  fecha_inscripcion: z.coerce.date({ message: "Fecha de inscripción inválida" }),
  imagen: z.instanceof(File).optional(),
});

export type UserPostData = z.infer<typeof userSchema>;