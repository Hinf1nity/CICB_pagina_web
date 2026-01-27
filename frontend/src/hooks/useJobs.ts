import { useState, useEffect } from "react";
import api from "../api/kyClient";
import { type JobData } from "../validations/jobsSchema";
import { presignedUrlPost, presignedUrlPatch } from "./presignedUrl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useJobsPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: JobData) => {
      let pdfId: string | null = null;

      if (data.pdf) {
        pdfId = await presignedUrlPost(data.pdf as File);
      }
      const formData = new FormData();
      formData.append("titulo", data.titulo);
      formData.append("nombre_empresa", data.nombre_empresa);
      formData.append("ubicacion", data.ubicacion);
      formData.append("tipo_contrato", data.tipo_contrato);
      if (data.salario) {
        formData.append("salario", data.salario);
      }
      formData.append("descripcion", data.descripcion);
      formData.append("sobre_empresa", data.sobre_empresa);
      formData.append("estado", data.estado);
      data.requisitos.forEach((req, index) => {
        formData.append(`requisitos[${index}]`, req);
      });
      data.responsabilidades.forEach((res, index) => {
        formData.append(`responsabilidades[${index}]`, res);
      });
      if (pdfId) {
        formData.append("pdf", pdfId);
      }
      console.log("FormData entries:", Array.from(formData.entries()));

      const response = await api.post("jobs/job_admin/", { body: formData });

      return response.json();
    },
    onSuccess: () => {
      toast.success("Empleo creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ['jobs_admin'] });
    },
    onError: () => {
      toast.error("Error al crear el trabajo");
    }
  });
}

export function useJobs() {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const data: JobData[] = await api.get("jobs/job/").json();
      const formattedData: JobData[] = data.results.map((job) => ({
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

  useEffect(() => { fetchJobs(); }, []);
  return { jobs, loading, error };
}

export function useJobDetail(id?: string) {
  const fetchJob = async () => {
    let pdf_url: string | null = null;
    const data: JobData = await api.get(`jobs/job/${id}/`).json();
    console.log(data);
    if (data.pdf) {
      const pdf_url_response = await api
        .get(`jobs/job/${data.id}/pdf-download/`)
        .json<{ download_url: string }>();
      pdf_url = pdf_url_response.download_url;
    }
    const formattedJob: JobData = {
      ...data,
      requisitos:
        typeof data.requisitos === "string"
          ? (data.requisitos as string)
            .split(",")
            .map((r: string) => r.trim())
            .filter((r: string) => r.length > 0)
          : data.requisitos || [],
      responsabilidades:
        typeof data.responsabilidades === "string"
          ? (data.responsabilidades as string)
            .split(",")
            .map((r: string) => r.trim())
            .filter((r: string) => r.length > 0)
          : data.responsabilidades || [],
      pdf_url: pdf_url ? pdf_url : undefined,
    };
    return formattedJob;
  };

  const { data, isPending, error } = useQuery({
    queryKey: ['job_user', id],
    queryFn: fetchJob,
    enabled: !!id,
  });
  return {
    data,
    isPending,
    error,
  };
}

// --- HOOKS Y FUNCIONES PARA ADMIN ---

export function useJobsAdmin() {
  const {
    data,
    isPending,
  } = useQuery({
    queryKey: ['jobs_admin'],
    queryFn: async () => {
      const data: JobData[] = await api.get("jobs/job_admin/").json();
      console.log(data);
      return data.results
    },
  });
  return {
    data: data ?? [],
    isPending,
  };
}

export async function useJobDetailAdmin(id: string) {
  let pdf_url: string | null = null;
  let pdf_id: string | null = null;

  const data: JobData = await api.get(`jobs/job_admin/${id}/`).json();

  if (data.pdf) {
    try {
      const pdf_url_response = await api
        .get(`jobs/job/${data.id}/pdf-download/`)
        .json<{ download_url: string, pdf_id: string }>();

      pdf_url = pdf_url_response.download_url;
      pdf_id = pdf_url_response.pdf_id;
    } catch (e) {
      console.warn("Aviso: El archivo PDF físico no se encontró en el servidor (404).");
    }
  }

  const formattedJob: JobData = {
    ...data,
    requisitos:
      typeof data.requisitos === "string"
        ? (data.requisitos as string)
          .split(",")
          .map((r: string) => r.trim())
          .filter((r: string) => r.length > 0)
        : data.requisitos || [],
    responsabilidades:
      typeof data.responsabilidades === "string"
        ? (data.responsabilidades as string)
          .split(",")
          .map((r: string) => r.trim())
          .filter((r: string) => r.length > 0)
        : data.responsabilidades || [],
    pdf: pdf_url ? pdf_url : undefined,
    pdf_url: pdf_id ? `${pdf_id}` : undefined,
    salario: data.salario ? data.salario : '',
  };

  return formattedJob;
}

export function useJobPatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      data_old,
    }: { id: number; data: JobData; data_old: JobData }) => {
      const formData = new FormData();
      let hasChanges = false;

      const appendIfChanged = (key: string, newValue: any, oldValue: any) => {
        if (newValue !== oldValue) {
          formData.append(key, newValue);
          hasChanges = true;
        }
      };
      appendIfChanged("titulo", data.titulo, data_old.titulo);
      appendIfChanged("nombre_empresa", data.nombre_empresa, data_old.nombre_empresa);
      appendIfChanged("ubicacion", data.ubicacion, data_old.ubicacion);
      appendIfChanged("tipo_contrato", data.tipo_contrato, data_old.tipo_contrato);
      appendIfChanged("salario", data.salario || "", data_old.salario || "");
      appendIfChanged("descripcion", data.descripcion, data_old.descripcion);
      appendIfChanged("sobre_empresa", data.sobre_empresa, data_old.sobre_empresa);
      appendIfChanged("estado", data.estado, data_old.estado);

      if (JSON.stringify(data.requisitos) !== JSON.stringify(data_old.requisitos)) {
        data.requisitos.forEach((req) => {
          formData.append(`requisitos`, req);
        });
        hasChanges = true;
      }

      if (JSON.stringify(data.responsabilidades) !== JSON.stringify(data_old.responsabilidades)) {
        data.responsabilidades.forEach((res) => {
          formData.append(`responsabilidades`, res);
        });
        hasChanges = true;
      }

      if (data.pdf !== data_old.pdf) {
        if (data_old.pdf_url) {
          const uploadRes = await presignedUrlPatch(
            data.pdf as File,
            data_old.pdf_url as string
          );
          if (!uploadRes) {
            throw new Error("Error al subir el PDF");
          }
        } else {
          const pdfId = await presignedUrlPost(data.pdf as File);
          formData.append("pdf", pdfId);
        }
        hasChanges = true;
      }

      if (!hasChanges) {
        return { message: "Sin cambios en base de datos" };
      }
      console.log("FormData entries:", formData);
      const response = await api.patch(`jobs/job_admin/${id}/`, { body: formData });

      return response.json();
    },
    onSuccess: (_data: any) => {
      if (_data.message) {
        toast.info("No se realizaron cambios");
        return;
      }
      toast.success("Empleo actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ['jobs_admin'] });
    },
    onError: () => {
      toast.error("Error al actualizar el empleo");
    }
  });
}

export function useJobDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`jobs/job_admin/${id}/`);
      return response.status === 204;
    },
    onSuccess: () => {
      toast.success("Empleo eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ['jobs_admin'] });
    },
    onError: () => {
      toast.error("Error al eliminar el empleo");
    },
    onMutate: () => {
      const toastId = toast.loading("Eliminando empleo...");
      return { toastId };
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
    },
  });
}
