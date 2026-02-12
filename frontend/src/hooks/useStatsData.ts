import api from "../api/kyClient";
import { useQuery } from "@tanstack/react-query";

export function useStatsData() {
  return useQuery({
    queryKey: ['stats', 'dashboard'],
    queryFn: async () => {
      // Ejecutamos ambas peticiones en paralelo para ganar velocidad
      const [stats, history] = await Promise.all([
        api.get("stats/users/").json<any>(),
        api.get("stats/history/").json<any>()
      ]);

      // Retornamos un objeto con los datos crudos
      return { stats, history };
    },
    // La propiedad 'select' es ideal para transformar los datos. 
    // React Query memoriza este resultado automáticamente.
    select: ({ stats, history }) => {
      const specialties = stats.specialties_breakdown.map((s: any) => ({
        specialty: s.especialidad.charAt(0).toUpperCase() + s.especialidad.slice(1),
        count: s.count,
        percentage: (s.count / stats.total_users) * 100,
      }));

      const departments = stats.state_breakdown.map((d: any) => ({
        department: d.departamento,
        engineers: d.total_count,
        active: d.active_count,
        inactive: d.inactive_count,
      }));

      const employment = [
        {
          name: "Con Trabajo",
          value: Math.round((stats.employment_rate / 100) * stats.total_users),
          percentage: stats.employment_rate,
        },
        {
          name: "Sin Trabajo",
          value: Math.round(((100 - stats.employment_rate) / 100) * stats.total_users),
          percentage: 100 - stats.employment_rate,
        }
      ];

      const evolution = history.map((e: any) => ({
        year: e.year,
        total: e.total_users_cumulative,
        new: e.new_users_count,
      }));

      return { specialties, departments, employment, evolution };
    },
  });
}