import { z } from "zod";

const status = ["borrador", "publicado"];
const categories = ["institucional", "normativa", "eventos", "premios", "capacitacion"];

export const newsSchema = z.object({
  title: z.string().min(2).max(100),
  category: z.enum(categories),
  img: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "La imagen no debe superar los 5MB")
    .optional()
    .or(z.literal(null)),
  excerpt: z.string().max(200),
  content: z.string().min(10),
  pdf: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", "Debe ser un PDF")
    .refine((file) => file.size <= 10 * 1024 * 1024, "El PDF no debe superar los 10MB")
    .optional()
    .or(z.literal(null)),
  status: z.enum(status),
});