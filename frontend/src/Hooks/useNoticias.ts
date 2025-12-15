import { useEffect, useState } from "react";
import api from '../api/kyClient';
import { type NewsPostData } from "../validations/newsSchema";

export function useNoticias(){
    const [noticias, setNoticias] = useState< NewsPostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNoticias = async () => {
        try{
            const data: NewsPostData[] = await api.get("news").json();
            setNoticias(data);
        }catch(err) {
            setError("Error al cargar las noticias");
        }finally{
            setLoading(false);
        }
    };
    fetchNoticias(); }, []);

  return { noticias, loading, error };

}

export function useNoticiaDetail(id?: string){
    const [noticia, setNoticias] = useState<NewsPostData>({} as NewsPostData);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNoticias = async () => {
        try{
            const data: NewsPostData = await api.get(`news/${id}`).json();
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
  const postNews = async (data: NewsPostData) => {
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