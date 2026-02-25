import { z } from "zod";

// Definicion de Zod
export const calculatorSchema = z.object({
  // Preprocesamos para evitar el error NaN al borrar el input
  yearsOfExperience: z.number({
    required_error: "Ingrese los años de antigüedad",
    message: "Es necesario ingresar un número",
  }).min(0, "Mínimo 0 años").max(99, "Máximo 99 años"),
  
  // Validacion de los strings del formulario
  department: z.string().min(1, "Seleccione un departamento"),

  educationLevel: z.string().min(1, "Seleccione un nivel académico"),
  
  location: z.enum(["ciudad", "campo"], {
    required_error: "Seleccione una ubicación"
  }),
  
  activityType: z.string().min(1, "Seleccione una actividad"),
});

// Extraccion del tipo de datos que se enviaron
export type FormData = z.infer<typeof calculatorSchema>;