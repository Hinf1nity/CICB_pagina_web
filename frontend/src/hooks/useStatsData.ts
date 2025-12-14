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
  employed: number;
  unemployed: number;
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
      const stats = await api.get("stats").json<any>();

      // Adaptación de los datos
      const specialtiesAdapted = stats.specialties.map((s: any) => ({
        specialty: s.name,
        count: s.value,
        percentage: 0, // puedes calcular porcentaje si quieres
      }));

      const departmentsAdapted = stats.departments.map((d: any) => ({
        department: d.name,
        engineers: d.value,
        active: Math.round(d.value * 0.8),
        inactive: Math.round(d.value * 0.2),
      }));

      const employmentAdapted = stats.employment.map((e: any) => ({
        name: e.name === "Empleado" ? "Con Trabajo" : "Sin Trabajo",
        value: e.value,
        percentage: 0,
      }));

      const evolutionAdapted = stats.evolution.map((e: any) => ({
        year: e.year,
        total: e.total,
        employed: Math.round(e.total * 0.85),
        unemployed: Math.round(e.total * 0.15),
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