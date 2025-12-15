import { z } from "zod";

const status = ["borrador", "publicado"];
const categories = ["institucional", "normativa", "eventos", "premios", "capacitacion"];

export const newsSchema = z.object({
  id: z.number().optional(),
  titulo: z.string().min(2, "El título debe tener al menos 2 caracteres").max(100, "El título no debe superar los 100 caracteres"),
  categoria: z.enum(categories, "Categoría inválida"),
  imagen_url: z.string().optional(),
  imagen: z
    .instanceof(File, { message: "Por favor, selecciona una imagen" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "La imagen no debe superar los 5MB"),
  resumen: z.string().min(2, "El extracto debe tener al menos 2 caracteres").max(200, "El extracto no debe superar los 200 caracteres"),
  descripcion: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
  pdf_url: z.string().optional(),
  pdf: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", "Debe ser un PDF")
    .refine((file) => file.size <= 10 * 1024 * 1024, "El PDF no debe superar los 10MB")
    .optional()
    .or(z.literal(null)),
  estado: z.enum(status, "Estado inválido"),
  fecha_publicacion: z.string().refine((date) => !isNaN(Date.parse(date)), "Fecha inválida").optional(),
});

export type NewsPostData = z.infer<typeof newsSchema>;