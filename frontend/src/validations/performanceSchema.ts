import {z} from 'zod';

export const performanceSchema = z.object({
    codigo: z.string().min(1, 'El código es obligatorio'),
    unidad: z.string().min(1, 'La unidad es obligatoria'),
    descripcion: z.string().min(1, 'La descripción es obligatoria'),
    categoria: z.string().min(1, 'La categoría es obligatoria'),
    recursos: z.array(z.object({
        nombre: z.string().min(1, 'El nombre es obligatorio'),
        unidad: z.string().min(1, 'La unidad es obligatoria'),
        cantidad: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'La cantidad debe ser un número positivo'),
    })).min(1, 'Debe haber al menos un recurso').refine((data) => data.length > 0, 'Debe haber al menos un recurso'),
});

export type PerformancePostData = z.infer<typeof performanceSchema>;