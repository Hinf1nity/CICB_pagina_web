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
  responsibilities: string;
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
    responsibilities: "",
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