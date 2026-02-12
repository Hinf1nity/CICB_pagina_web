import { z } from 'zod';

export const recursoSchema = z.object({
    id: z.number().optional(),
    nombre: z.string().min(1, 'El nombre del recurso es obligatorio'),
    unidad: z.string().min(1, 'La unidad del recurso es obligatoria'),
});

export type Recurso = z.infer<typeof recursoSchema>;

export const performanceSchema = z.object({
    id: z.number().optional(),
    codigo: z.string().min(1, 'El código es obligatorio'),
    unidad: z.string().min(1, 'La unidad es obligatoria'),
    actividad: z.string().min(1, 'La descripción es obligatoria'),
    categoria: z.string().min(1, 'La categoría es obligatoria'),
    recursos_info: z.array(z.object({
        recurso: recursoSchema.or(z.string()),
        cantidad: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'La cantidad debe ser un número positivo'),
    })).min(1, 'Debe haber al menos un recurso').refine((data) => data.length > 0, 'Debe haber al menos un recurso'),
});

export type PerformanceData = z.infer<typeof performanceSchema>;