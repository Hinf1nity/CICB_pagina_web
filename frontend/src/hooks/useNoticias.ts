import { useEffect, useState } from "react";
import api from '../api/kyClient';
import { type NewsData } from "../validations/newsSchema";
import { presignedUrlPost } from "./presignedUrlPost";

export function useNoticiasAdmin() {
  const [noticias, setNoticias] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNoticias = async () => {
    try {
      const data: NewsData[] = await api.get("news/news_admin/").json();
      setNoticias(data);
    } catch (err) {
      setError("Error al cargar las noticias");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNoticias();
  }, []);

  return { noticias, loading, error, refetchNoticias: fetchNoticias };
}

export function useNoticias() {
  const [noticias, setNoticias] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNoticias = async () => {
    try {
      const data: NewsData[] = await api.get("news/news/").json();
      for (const noticia of data) {
        if (noticia.imagen) {
          const img_url_response = await api
            .get(`news/news/${noticia.id}/img-download/`)
            .json<{ download_url: string }>();
          noticia.imagen_url = img_url_response.download_url;
        }
      }
      setNoticias(data);
    } catch (err) {
      setError("Error al cargar las noticias");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNoticias();
  }, []);

  return { noticias, loading, error };
}

export function useNoticiaDetail(id?: string) {
  const [noticia, setNoticias] = useState<NewsData>({} as NewsData);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const data: NewsData = await api.get(`news/news/${id}`).json();
        if (data.pdf) {
          const pdf_url_response = await api
            .get(`news/news/${data.id}/pdf-download/`)
            .json<{ download_url: string }>();
          data.pdf_url = pdf_url_response.download_url;
        }
        if (data.imagen) {
          const img_url_response = await api
            .get(`news/news/${data.id}/img-download/`)
            .json<{ download_url: string }>();
          data.imagen_url = img_url_response.download_url;
        }
        setNoticias(data);
        console.log(data);
      } catch (err) {
        setError("Error al cargar las noticias");
      } finally {
        setLoading(false);
      }
    };
    fetchNoticias();
  }, [id]);

  return { noticia, loading, error };

}

export function useNewsPost() {
  const postNews = async (data: NewsData) => {
    let pdf_id: string | null = null;
    let img_id: string | null = null;

    // Subir PDF si existe
    if (data.pdf) {
      pdf_id = await presignedUrlPost(data.pdf);
    }
    // Subir Imagen si existe
    if (data.imagen) {
      img_id = await presignedUrlPost(data.imagen);
    }
    // Crear FormData
    const formData = new FormData();
    formData.append("titulo", data.titulo);
    formData.append("categoria", data.categoria);
    formData.append("resumen", data.resumen);
    formData.append("descripcion", data.descripcion);
    formData.append("estado", data.estado);
    // Archivos opcionales
    if (img_id) {
      formData.append("imagen", img_id);
    }
    if (pdf_id) {
      formData.append("pdf", pdf_id);
    }

    const response = await api.post("news/news_admin/", {
      body: formData,
    });

    return response.json();
  };

  return { postNews };
}

export function useNewsPatch() {
  const patchNews = async (id: string, data: NewsData, data_old: NewsData) => {
    // Crear FormData
    const formData = new FormData();
    if (data.titulo !== data_old.titulo) {
      formData.append("titulo", data.titulo);
    }
    if (data.categoria !== data_old.categoria) {
      formData.append("categoria", data.categoria);
    }
    if (data.resumen !== data_old.resumen) {
      formData.append("resumen", data.resumen);
    }
    if (data.descripcion !== data_old.descripcion) {
      formData.append("descripcion", data.descripcion);
    }
    if (data.estado !== data_old.estado) {
      formData.append("estado", data.estado);
    }
    // Archivos opcionales
    // if (data.imagen && data.imagen !== data_old.imagen) {
    //   formData.append("imagen", data.imagen);
    // }
    // if (data.pdf && data.pdf !== data_old.pdf) {
    //   formData.append("pdf", data.pdf);
    // }
    const response = await api.patch(`news/news_admin/${id}/`, {
      body: formData,
    });
    return response.json();
  };

  return { patchNews };
}