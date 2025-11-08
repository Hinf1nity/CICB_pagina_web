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
