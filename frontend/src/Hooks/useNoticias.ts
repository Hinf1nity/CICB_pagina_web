import { useEffect, useState } from "react";
import api from '../Api/kyClient';

export interface Noticia{
    id: number;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    image: string;
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
            console.log(data);
        }catch(err) {
            setError("Error al cargar las noticias");
        }finally{
            setLoading(false);
        }
    };
    fetchNoticias(); }, []);

  return { noticias, loading, error };

}
