import { z } from "zod";

const estados = ["borrador", "publicado", "archivado"];
const categories = ["Ingeniería Estructural", "Ingeniería Hidráulica", "Ingeniería Sanitaria", "Vias y Transporte", "Ingeniería Geotécnica", "Gerencias de la Construcción", "otros"];
export const virtualLibrarySchema = z.object({
    id: z.number().optional(),
    titulo: z.string().min(2, { message: "Título demasiado corto" }).max(200, { message: "Título demasiado largo" }),
    descripcion: z.string().min(10, { message: "Descripción demasiado corta" }).max(1000, { message: "Descripción demasiado larga" }),
    categoria: z.enum(categories, { message: "Categoría inválida" }),
    autor: z.string().min(2, { message: "Autor demasiado corto" }).max(100, { message: "Autor demasiado largo" }),
    anio: z.string().refine((val) => /^\d{4}$/.test(val), { message: "Año inválido" }),
    estado: z.enum(estados, { message: "El estado debe ser 'borrador' o 'publicado'" }),
    pdf: z
        .instanceof(File, { message: "El archivo debe ser un PDF" })
        .refine((file) => file.type === "application/pdf", "Debe ser un PDF")
        .refine((file) => file.size <= 200 * 1024 * 1024, "El PDF no debe superar los 200MB").or(z.string()),
    pdf_url: z.string().optional(),
});

export type VirtualDocument = z.infer<typeof virtualLibrarySchema>