import { z } from "zod";

const status = ["borrador", "publicado"];
const contractTypes = ["completo", "contrato", "freelance"];


export const jobSchema = z.object({
  id: z.number().optional(),
  titulo: z.string().min(2, { message: "El título debe tener al menos 2 caracteres" }).max(100),
  descripcion: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }).max(1000),
  nombre_empresa: z.string().min(2, { message: "La empresa debe tener al menos 2 caracteres" }).max(100),
  sobre_empresa: z.string().min(10, { message: "La información sobre la empresa debe tener al menos 10 caracteres" }).max(1000),
  ubicacion: z.string().min(2, { message: "La ubicación debe tener al menos 2 caracteres" }).max(100),
  fecha_publicacion: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Fecha inválida" }).optional(),
  tipo_contrato: z.enum(contractTypes, { message: `El tipo de contrato debe ser uno de los siguientes: ${contractTypes.join(", ")}` }),
  salario: z.string().max(100).refine((value) => value === '' || /^[0-9]+(\.[0-9]+)?$/.test(value), { message: "El salario debe ser un número positivo" }).optional(),
  requisitos: z.array(z.string().min(2, { message: "El requisito debe tener al menos 2 caracteres" }).max(200)).refine((arr) => arr.length > 0, { message: "Debe haber al menos un requisito" }),
  responsabilidades: z.array(z.string().min(2, { message: "La responsabilidad debe tener al menos 2 caracteres" }).max(200)).refine((arr) => arr.length > 0, { message: "Debe haber al menos una responsabilidad" }),
  pdf_url: z.string().optional(),
  pdf: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", "Debe ser un PDF")
    .refine((file) => file.size <= 10 * 1024 * 1024, "El PDF no debe superar los 10MB")
    .optional()
    .or(z.literal(null))
    .or(z.string()),
  estado: z.enum(status, { message: `El estado debe ser uno de los siguientes: ${status.join(", ")}` }),
});

export type JobData = z.infer<typeof jobSchema>;