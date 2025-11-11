import { z } from "zod";

const status = ["borrador", "publicado"];
const contractTypes = ["completo", "contrato", "freelance"];


export const jobSchema = z.object({
  title: z.string().min(2, { message: "El título debe tener al menos 2 caracteres" }).max(100),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }).max(1000),
  company: z.string().min(2, { message: "La empresa debe tener al menos 2 caracteres" }).max(100),
  location: z.string().min(2, { message: "La ubicación debe tener al menos 2 caracteres" }).max(100),
  type: z.enum(contractTypes, { message: `El tipo de contrato debe ser uno de los siguientes: ${contractTypes.join(", ")}` }),
  salary: z.string().min(1, { message: "El salario debe tener al menos 1 carácter" }).max(100),
  requirements: z.array(z.string().min(2, { message: "El requisito debe tener al menos 2 caracteres" }).max(100)),
  responsibilities: z.array(z.string().min(2, { message: "La responsabilidad debe tener al menos 2 caracteres" }).max(100)),
  pdf: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", "Debe ser un PDF")
    .refine((file) => file.size <= 10 * 1024 * 1024, "El PDF no debe superar los 10MB")
    .optional()
    .or(z.literal(null)),
  status: z.enum(status, { message: `El estado debe ser uno de los siguientes: ${status.join(", ")}` }),
});

export type Job = z.infer<typeof jobSchema>;