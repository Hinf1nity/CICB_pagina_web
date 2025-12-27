import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  const { data: noticias = [], isLoading: loading, isError, error } = useQuery({
    queryKey: ['noticias'],
    queryFn: async () => {
      const data: NewsData[] = await api.get("news/news/").json();
      console.log(data);
      return data.map(item => ({
        ...item,
        img_url: item.imagen?.url,
        imagen: undefined
      }));
    },
    staleTime: 1000 * 60 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 6,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { noticias, loading, isError, error };
}

export function useNoticiaDetail(id?: string) {
  const fetchNoticias = async () => {
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
    console.log(data);
    return data;
  };

  const { data: noticia, isLoading: loading, isError, error } = useQuery({
    queryKey: ['noticia', id],
    queryFn: fetchNoticias,
    staleTime: 1000 * 60 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 6,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!id,
  });

  return { noticia, loading, isError, error };

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