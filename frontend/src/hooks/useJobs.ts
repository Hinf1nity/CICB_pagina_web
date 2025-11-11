import api from "../api/kyClient";

export interface JobPostData {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  pdf?: File | null;
  status: string;
}

export function useJobsPost() {
  const postJob = async (data: JobPostData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("company", data.company);
    formData.append("location", data.location);
    formData.append("type", data.type);
    formData.append("salary", data.salary);
    formData.append("description", data.description);
    formData.append("status", data.status);
    data.requirements.forEach((req, index) => {
      formData.append(`requirements[${index}]`, req);
    });
    data.responsibilities.forEach((res, index) => {
      formData.append(`responsibilities[${index}]`, res);
    });
    const response = await api.post('/jobs', { body: formData });
    return response.json();
  };

  return { postJob };
}
import { useEffect, useState } from "react";
import api from "../api/kyClient";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  date: string;
  description: string;
  requirements: string[];
}

interface JobDetail {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  date: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  informacion: string;
  pdfUrl?: string;
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data: any[] = await api.get("jobs").json();
        const formattedData: Job[] = data.map((job) => ({
          ...job,
          requirements:
            typeof job.requirements === "string"
              ? job.requirements
                  .split(",")
                  .map((r: string) => r.trim())
                  .filter((r: string) => r.length > 0)
              : job.requirements || [],
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
  const [job, setJob] = useState<JobDetail>({
    id: 0,
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    date: "",
    description: "",
    requirements: [],
    responsibilities: [],
    informacion: "",
    pdfUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data: any = await api.get(`jobs/${id}`).json();
        const formattedJob: JobDetail = {
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