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
  requirements: string;
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
  requirements: string;
  responsibilities: string,
  pdfUrl?: string;
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data: Job[] = await api.get("jobs").json();
        setJobs(data);
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
    requirements: "",
    responsibilities: "",
    pdfUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data: JobDetail = await api.get(`jobs/${id}`).json();
        setJob(data);
        console.log(data);
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