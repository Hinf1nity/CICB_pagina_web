import { useEffect, useState } from "react";
import api from "../api/kyClient";
import { type JobPostData } from "../validations/jobsSchema";

export function useJobsPost() {
  const postJob = async (data: JobPostData) => {
    const formData = new FormData();
    formData.append("titulo", data.titulo);
    formData.append("nombre_empresa", data.nombre_empresa);
    formData.append("ubicacion", data.ubicacion);
    formData.append("tipo_contrato", data.tipo_contrato);
    formData.append("salario", data.salario);
    formData.append("descripcion", data.descripcion);
    formData.append("estado", data.estado);
    data.requisitos.forEach((req, index) => {
      formData.append(`requisitos[${index}]`, req);
    });
    data.responsabilidades.forEach((res, index) => {
      formData.append(`responsabilidades[${index}]`, res);
    });
    console.log("PDF file to upload:", data);
    const response = await api.post('jobs/', { body: formData });
    return response.json();
  };

  return { postJob };
}

export function useJobs() {
  const [jobs, setJobs] = useState<JobPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data: any[] = await api.get("jobs").json();
        const formattedData: JobPostData[] = data.map((job) => ({
          ...job,
          requisitos:
            typeof job.requisitos === "string"
              ? job.requisitos
                  .split(",")
                  .map((r: string) => r.trim())
                  .filter((r: string) => r.length > 0)
              : job.requisitos || [],
        }));

        setJobs(formattedData);
      } catch (err) {
        setError("Error al cargar los empleos");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return { jobs, loading, error };
}

export function useJobDetail(id?: string) {
  const [job, setJob] = useState<JobPostData>({} as JobPostData);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data: any = await api.get(`jobs/${id}`).json();
        const formattedJob: JobPostData = {
          ...data,
          requirements:
            typeof data.requirements === "string"
              ? data.requirements
                  .split(",")
                  .map((r: string) => r.trim())
                  .filter((r: string) => r.length > 0)
              : data.requirements || [],
        };

        setJob(formattedJob);
      } catch (err) {
        setError("Error al cargar los detalles del empleo");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  return { job, loading, error };
}