import { useEffect, useState } from "react";
import api from '../api/kyClient';
import { type NewsPostData } from "../validations/newsSchema";
interface Noticia{
    id: number;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    image: string;
    pdf?: string;
}

interface NoticiaDetail{
    id: number;
    title: string;
    category: string;
    date: string;
    image: string;
    content: string;
    pdf?: string;
}

export function useNoticias(){
    const [noticias, setNoticias]=useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNoticias = async () => {
        try{
            const data: Noticia[] = await api.get("noticias").json();
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
    const [noticia, setNoticias] = useState<NoticiaDetail>({
  id: 0,
  title: "",
  category: "",
  date: "",
  image: "",
  content: "",
  pdf: ""
});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNoticias = async () => {
        try{
            const data: NoticiaDetail = await api.get(`noticias/${id}`).json();
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