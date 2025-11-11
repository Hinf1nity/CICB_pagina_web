import api from "../api/kyClient";

export interface NewsPostData {
  title: string;
  category: string;
  img?: File | null;
  excerpt: string;
  content: string;
  pdf?: File | null;
  status: string;
}

export function useNewsPost() {
  const postNews = async (data: NewsPostData) => {
    // Crear FormData
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("excerpt", data.excerpt);
    formData.append("content", data.content);
    formData.append("status", data.status);

    // Archivos opcionales
    if (data.img) {
      formData.append("img", data.img);
    }
    if (data.pdf) {
      formData.append("pdf", data.pdf);
    }

    const response = await api.post("public/news/", {
      body: formData,
    });

    return response.json();
  };

  return { postNews };
}