import { useQuery, useMutation } from "@tanstack/react-query";
import { type FormData } from "../validations/CalculatorSchema";
import api from "../api/kyClient";

export function useCalculatorData() {
  // 1. Obtener opciones (GET)
  const optionsQuery = useQuery({
    queryKey: ["arancelesOptions"],
    queryFn: async () => {
      // Endpoint confirmado de la App
      const data: any = await api.get("aranceles/aranceles/").json();
      return {
        grados: (data.formaciones || []).map((f: string) => ({ label: f, value: f })),
        actividades: (data.actividades || []).map((a: string) => ({ label: a, value: a })),
      };
    },
  });

  // 2. Realizar Cálculo (POST)
  const calculateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const payload = {
        antiguedad: formData.yearsOfExperience,
        departamento: formData.department,
        formacion: formData.educationLevel,
        ubicacion: formData.location,
        actividad: formData.activityType,
      };

      // Envío de datos al backend
      const result: any = await api.post("aranceles/aranceles/", { json: payload }).json();

      // TRANSFORMACIÓN: De estructura Backend a estructura Web (ResultsDisplay)
      // Usamos Math.round para cumplir con el punto 5 (solo enteros)
      return {
        monthlyFee: Math.round(result.mensual || 0),
        dailyFee: Math.round(result.diario || 0),
        hourlyFee: Math.round(result.hora || 0),

        // Mapeo dinámico basado en detailData.ts para evitar el error de 'undefined'
        workCategories: (result.trabajos || []).map((t: any) => ({
          category: t.nombre.toUpperCase(), // Sincronizado con la App
          complexityLevels: (t.niveles || []).map((n: any) => ({
            level: n.nombre.toUpperCase(),
            items: (n.elementos || []).map((e: any) => ({
              name: e.detalle,
              // Convertimos a costo numérico y redondeamos
              cost: Math.round(e.valor || 0),
              unidad: e.unidad,
            }))
          }))
        })),
      };
    },
  });

  return {
    actividades: optionsQuery.data?.actividades || [],
    educationLevels: optionsQuery.data?.grados || [],
    isLoadingData: optionsQuery.isLoading,
    calculateMutation,
  };
}