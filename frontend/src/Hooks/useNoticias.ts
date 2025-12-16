import { useEffect, useState } from "react";
import api from '../api/kyClient';
import { type NewsData } from "../validations/newsSchema";

export function useNoticias(){
    const [noticias, setNoticias] = useState< NewsData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNoticias = async () => {
        try{
            const data: NewsData[] = await api.get("news").json();
            setNoticias(data);
        }catch(err) {
            setError("Error al cargar las noticias");
        }finally{
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchNoticias(); }, []);

  return { noticias, loading, error, refetchNoticias: fetchNoticias };

}

export function useNoticiaDetail(id?: string){
    const [noticia, setNoticias] = useState<NewsData>({} as NewsData);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNoticias = async () => {
        try{
            const data: NewsData = await api.get(`news/${id}`).json();
            setNoticias(data);
            console.log(data);
        }catch(err) {
            setError("Error al cargar las noticias");
        }finally{
            setLoading(false);
        }
    };
    fetchNoticias(); }, [id]);

  return { noticia, loading, error };

}

export function useNewsPost() {
  const postNews = async (data: NewsData) => {
    // Crear FormData
    const formData = new FormData();
    formData.append("titulo", data.titulo);
    formData.append("categoria", data.categoria);
    formData.append("resumen", data.resumen);
    formData.append("descripcion", data.descripcion);
    formData.append("estado", data.estado);
    // Archivos opcionales
    if (data.imagen) {
      formData.append("imagen", data.imagen);
    }
    if (data.pdf) {
      formData.append("pdf", data.pdf);
    }

    const response = await api.post("news/", {
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
    const response = await api.patch(`news/${id}/`, {
      body: formData,
    });
    return response.json();
  };

  return { patchNews };
}