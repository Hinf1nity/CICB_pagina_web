import { z } from "zod";

const estados = ["borrador", "publicado", "archivado", "vigente", "activa", "cerrada"];

export const genericSchema = z.object({
  id: z.number().optional(),
  titulo: z.string().min(2, { message: "El título debe tener al menos 2 caracteres" }).max(200),
  descripcion: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }).max(2000),
  fecha_publicacion: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Fecha de publicación inválida" }),
  pdf_url: z.string().optional(),
  pdf: z
    .instanceof(File, { message: "El archivo debe ser un PDF" })
    .refine((file) => file.type === "application/pdf", "Debe ser un PDF")
    .refine((file) => file.size <= 10 * 1024 * 1024, "El PDF no debe superar los 10MB"),
  estado: z.enum(estados, { message: "El estado debe ser 'borrador' o 'publicado'" }),
});

export type GenericData = z.infer<typeof genericSchema>;