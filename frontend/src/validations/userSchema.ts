import { z } from "zod";

const departamentos = ["La Paz", "Cochabamba", "Santa Cruz", "Oruro", "Potosí", "Tarija", "Chuquisaca", "Beni", "Pando"];
const especialidades = ["estructural", "hidráulica", "geotecnia", "vial", "ambiental", "construcción", "sanitaria", "transporte", "civil"];
const estados = ["activo", "inactivo"];
const employeeStatuses = ["empleado", "desempleado"];
export const userSchema = z.object({
  id: z.number().optional(),
  nombre: z.string().min(2, { message: "Nombre demasiado corto" }).max(100, { message: "Nombre demasiado largo" }),
  rni: z.string().refine((val) => /^\d{6,10}$/.test(val), { message: "RNI inválido" }),
  rnic: z.string().refine((val) => /^\d{6,10}$/.test(val), { message: "RNIC inválido" }).optional(),
  especialidad: z.enum(especialidades, { message: "Especialidad inválida" }),
  celular: z.string().refine((val) => /^\+?\d{7,15}$/.test(val), { message: "Número de celular inválido" }),
  departamento: z.enum(departamentos, { message: "Departamento inválido" }),
  registro_empleado: z.enum(employeeStatuses).optional(),
  estado: z.enum(estados, { message: "Estado inválido" }),
  fecha_inscripcion: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Fecha de inscripción inválida" }),
  imagen: z.instanceof(File).optional().or(z.string().optional()),
  imagen_url: z.string().optional(),
  mail: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: "Correo electrónico inválido" }).optional(),
  certificaciones: z.array(z.object({
    nombre: z.string().optional(),
    institucion: z.string().optional(),
    anio: z.string().refine((val) => /^\d{4}$/.test(val), { message: "Año inválido" }).optional(),
  })).optional(),
});

export type UserData = z.infer<typeof userSchema>;