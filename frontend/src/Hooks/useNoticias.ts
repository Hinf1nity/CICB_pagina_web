import { useEffect, useState } from "react";
import api from '../api/kyClient';

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
    fetchNoticias(); }, []);

  return { noticia, loading, error };

}
