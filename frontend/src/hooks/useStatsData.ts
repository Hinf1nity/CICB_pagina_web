import { useEffect, useState } from "react";
import api from "../api/kyClient";

interface Specialty {
  specialty: string;
  count: number;
  percentage?: number;
}

interface Department {
  department: string;
  engineers: number;
  active: number;
  inactive: number;
}

interface Employment {
  name: string;
  value: number;
  percentage?: number;
}

interface Evolution {
  year: string;
  total: number;
  new: number;
}

export function useStatsData() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employment, setEmployment] = useState<Employment[]>([]);
  const [evolution, setEvolution] = useState<Evolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // JSON-server devuelve directamente el objeto con specialties, departments, etc.
      const stats = await api.get("stats/users/").json<any>();
      console.log("Datos de estadísticas recibidos:", stats);

      // Adaptación de los datos
      const specialtiesAdapted = stats.specialties_breakdown.map((s: any) => ({
        specialty: s.especialidad.charAt(0).toUpperCase() + s.especialidad.slice(1),
        count: s.count,
        percentage: (s.count / stats.total_users) * 100, // puedes calcular porcentaje si quieres
      }));

      const departmentsAdapted = stats.state_breakdown.map((d: any) => ({
        department: d.departamento,
        engineers: d.total_count,
        active: d.active_count,
        inactive: d.inactive_count,
      }));

      const employmentAdapted: Employment[] = [{
        name: "Con Trabajo",
        value: (stats.employment_rate / 100) * stats.total_users,
        percentage: stats.employment_rate,
      },
      {
        name: "Sin Trabajo",
        value: ((100 - stats.employment_rate) / 100) * stats.total_users,
        percentage: 100 - stats.employment_rate,
      }];

      const history = await api.get("stats/history/").json<any>();
      console.log("Datos de historia de empleo recibidos:", history);

      const evolutionAdapted = history.map((e: any) => ({
        year: e.year,
        total: e.total_users_cumulative,
        new: e.new_users_count,
      }));

      setSpecialties(specialtiesAdapted);
      setDepartments(departmentsAdapted);
      setEmployment(employmentAdapted);
      setEvolution(evolutionAdapted);

    } catch (err: any) {
      console.error(err);
      setError("Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    specialties,
    departments,
    employment,
    evolution,
    loading,
    error,
  };
}