import { useEffect, useState } from "react";
import api from '../Api/kyClient';

export interface Noticia{
    id: number;
    title: string;
    category: string;
    date: string;
    image: string;
    content: string;
    pdf?: string;
}
export function useNoticiaDetail(id?: string){
    const [noticia, setNoticias] = useState<Noticia>({
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
            const data: Noticia = await api.get(`noticias/${id}`).json();
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
