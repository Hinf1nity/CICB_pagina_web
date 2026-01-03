import { z } from "zod";

const especialidades = ["estructural", "hidráulica", "geotecnia", "vial", "ambiental", "construcción", "sanitaria", "transporte", "civil"];
const employeeStatuses = ["empleado", "desempleado"];

export const userPageSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    celular: z.string().refine((val) => /^\+?\d{7,15}$/.test(val), { message: "Número de celular inválido" }),
    especialidad: z.enum(especialidades).optional(),
    mail: z
        .string()
        .optional()
        .refine(
            (val) => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            { message: "Correo electrónico inválido" }
        ),
    certificaciones: z.array(z.object({
        nombre: z.string().optional(),
        institucion: z.string().optional(),
        anio: z.string().refine((val) => /^\d{4}$/.test(val), { message: "Año inválido" }).optional(),
    })).optional(),
    registro_empleado: z.enum(employeeStatuses).optional(),
    imagen: z.instanceof(File).optional().or(z.string().optional()),
    imagen_url: z.string().optional(),
});

export type UserPageData = z.infer<typeof userPageSchema>;