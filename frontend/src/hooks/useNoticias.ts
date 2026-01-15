import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from '../api/kyClient';
import { type NewsData } from "../validations/newsSchema";
import { presignedUrlPost, presignedUrlPatch } from "./presignedUrl";

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
  const {
    data: noticias, // Ya no necesitas valor por defecto aquí si usas initialData o placeholder, pero [] está bien
    isLoading, // Ojo: En v5 prefiere 'isPending' si quieres saber si no hay data aún
    isError,
    error
  } = useQuery({
    queryKey: ['noticias'],

    // 2. La función SOLO busca datos, no los toca.
    queryFn: async () => {
      // Asumimos que 'api' es tu instancia de Ky
      return await api.get("news/news/").json<NewsData[]>();
    },

    // 3. SELECT: Aquí ocurre la magia de la transformación
    // Esto permite que la caché guarde la respuesta original del servidor,
    // pero tu componente reciba la versión limpia.
    select: (data) => {
      return data.map((item) => ({
        ...item,
        imagen_url: item.imagen?.url,
        imagen: undefined, // Opcional: eliminar la ref original
      }));
    },
  });

  // Retornamos un array vacío por defecto si es undefined para evitar crash en el .map del UI
  return {
    noticias: noticias ?? [],
    isLoading,
    isError,
    error
  };
}

export async function useNoticiaDetailAdmin(id?: string) {
  const data: NewsData = await api.get(`news/news_admin/${id}`).json();
  if (data.pdf) {
    const pdf_url_response = await api
      .get(`news/news/${data.id}/pdf-download/`)
      .json<{ download_url: string, pdf_id: string }>();
    data.pdf_url = `${pdf_url_response.pdf_id}`;
    data.pdf = pdf_url_response.download_url;
  }
  if (data.imagen) {
    const img_url_response = await api
      .get(`news/news/${data.id}/img-download/`)
      .json<{ download_url: string, img_id: string }>();
    data.imagen_url = `${img_url_response.img_id}`;
    data.imagen = img_url_response.download_url;
  }
  console.log(data);
  return data;
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
    staleTime: 1000 * 60 * 15 * 1,
    gcTime: 1000 * 60 * 15 * 2,
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
    const formData = new FormData();
    let hasChanges = false;

    const appendIfChanged = (key: string, value: any) => {
      formData.append(key, value);
      hasChanges = true;
    };

    if (data.titulo !== data_old.titulo) {
      appendIfChanged("titulo", data.titulo);
    }
    if (data.categoria !== data_old.categoria) {
      appendIfChanged("categoria", data.categoria);
    }
    if (data.resumen !== data_old.resumen) {
      appendIfChanged("resumen", data.resumen);
    }
    if (data.descripcion !== data_old.descripcion) {
      appendIfChanged("descripcion", data.descripcion);
    }
    if (data.estado !== data_old.estado) {
      appendIfChanged("estado", data.estado);
    }
    if (data.imagen !== data_old.imagen) {
      hasChanges = false;

      if (data_old.imagen_url) {
        const uploadRes = await presignedUrlPatch(
          data.imagen as File,
          data_old.imagen_url as string
        );
        if (!uploadRes) {
          throw new Error("Error al subir la imagen");
        }
      } else {
        const imgId = await presignedUrlPost(data.imagen as File);
        formData.append("imagen", imgId);
      }
    }
    if (data.pdf !== data_old.pdf) {
      hasChanges = true;

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
    }

    if (!hasChanges) {
      return null;
    }

    const response = await api.patch(`news/news_admin/${id}/`, {
      body: formData,
    });
    return response.json();
  };

  return { patchNews };
}

export async function useNewsDelete(id: number) {
  const response = await api.delete(`news/news_admin/${id}/`);
  return response.status === 204;
}