import { useEffect, useState } from "react";
import api from "../api/kyClient";
import { type JobData } from "../validations/jobsSchema";

export function useJobsPost() {
  const postJob = async (data: JobData) => {
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
    if (data.pdf) {
      formData.append("pdf", data.pdf);
    }
    console.log("PDF file to upload:", data);
    const response = await api.post('jobs/', { body: formData });
    return response.json();
  };

  return { postJob };
}

export function useJobs() {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
      try {
        const data: JobData[] = await api.get("jobs").json();
        const formattedData: JobData[] = data.map((job) => ({
          ...job,
          requisitos:
            typeof job.requisitos === "string"
              ? (job.requisitos as string)
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

  useEffect(() => {
    fetchJobs();
  }, []);

  return { jobs, loading, error, refetchJobs: fetchJobs };
}

export function useJobDetail(id?: string) {
  const [job, setJob] = useState<JobData>({} as JobData);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data: JobData = await api.get(`jobs/${id}`).json();
        const formattedJob: JobData = {
          ...data,
          requisitos:
            typeof data.requisitos === "string"
              ? (data.requisitos as string)
                  .split(",")
                  .map((r: string) => r.trim())
                  .filter((r: string) => r.length > 0)
              : data.requisitos || [],
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

export function useJobPatch() {
  const patchJob = async (id: number, data: JobData, existingJob: JobData) => {
    const formData = new FormData();
    if (data.titulo !== existingJob.titulo) {
      formData.append("titulo", data.titulo);
    }
    if (data.nombre_empresa !== existingJob.nombre_empresa) {
      formData.append("nombre_empresa", data.nombre_empresa);
    }
    if (data.ubicacion !== existingJob.ubicacion) {
      formData.append("ubicacion", data.ubicacion);
    }
    if (data.tipo_contrato !== existingJob.tipo_contrato) {
      formData.append("tipo_contrato", data.tipo_contrato);
    }
    if (data.salario !== existingJob.salario) {
      formData.append("salario", data.salario);
    }
    if (data.descripcion !== existingJob.descripcion) {
      formData.append("descripcion", data.descripcion);
    }
    if (data.estado !== existingJob.estado) {
      formData.append("estado", data.estado);
    }
    if (JSON.stringify(data.requisitos) !== JSON.stringify(existingJob.requisitos)) {
      data.requisitos.forEach((req, index) => {
        formData.append(`requisitos[${index}]`, req);
      });
    }
    if (JSON.stringify(data.responsabilidades) !== JSON.stringify(existingJob.responsabilidades)) {
      data.responsabilidades.forEach((res, index) => {
        formData.append(`responsabilidades[${index}]`, res);
      });
    }
    if (data.pdf && data.pdf !== existingJob.pdf) {
      formData.append("pdf", data.pdf);
    }

    const response = await api.patch(`jobs/${id}/`, { body: formData });
    return response.json();
  };
  return { patchJob };
}