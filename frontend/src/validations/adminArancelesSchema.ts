import { z } from 'zod';

// 1. Esquema para los Elementos (el nivel más bajo)
export const ElementoSchema = z.object({
    id: z.number().optional(), // Opcional por si es nuevo
    detalle: z.string().min(1, "El detalle es requerido"),
    valor: z.number().nonnegative("El valor debe ser positivo"),
    unidad: z.string().min(1, "La unidad es requerida"),
});

// 2. Esquema para los Niveles
export const NivelSchema = z.object({
    id: z.number().optional(),
    nombre: z.string().min(1, "El nombre del nivel es requerido"),
    elementos: z.array(ElementoSchema),
});

// 3. Esquema para la Categoría (el objeto principal)
export const CategoriaSchema = z.object({
    id: z.number(), // Aquí es obligatorio según tu JSON
    nombre: z.string().min(1, "El nombre de la categoría es requerido"),
    niveles: z.array(NivelSchema),
});

// 4. Esquema para la lista completa (el array que recibes de Django)
export const ListaCategoriasSchema = z.array(CategoriaSchema);

// --- TIPOS DE TYPESCRIPT ---
// Esto extrae automáticamente los tipos de los esquemas de arriba
export type Elemento = z.infer<typeof ElementoSchema>;
export type Nivel = z.infer<typeof NivelSchema>;
export type Categoria = z.infer<typeof CategoriaSchema>;
export type ListaCategorias = z.infer<typeof ListaCategoriasSchema>;

export const IncidenciasSchema = z.object({
    id: z.number(),
    nombre: z.string().min(1, "El nombre de la incidencia es requerido"),
    valor: z.number().nonnegative("El valor debe ser positivo"),
});

export type Incidencia = z.infer<typeof IncidenciasSchema>;