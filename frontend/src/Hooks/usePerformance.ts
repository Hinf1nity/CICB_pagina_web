import { useEffect, useState } from "react";
import api from "../api/kyClient";
import { type PerformanceData } from "../validations/performanceSchema";

export function usePerformancePost() {
    const postPerformance = async (data: PerformanceData) => {
        const formData = new FormData();
        formData.append("codigo", data.codigo);
        formData.append("unidad", data.unidad);
        formData.append("descripcion", data.descripcion);
        formData.append("categoria", data.categoria);
        formData.append("recursos", JSON.stringify(data.recursos));
        await api.post("rendimientos", { body: formData }).json();
    };

    return { postPerformance };
}

export function usePerformance(){
    const[actions, setActions] = useState<PerformanceData[]>([]);
    const[loading, setLoading] = useState<boolean>(true);
    const[error, setError] = useState<string | null>(null);
    const fetchActions = async() => {
        try{
            setLoading(true);
            setError(null);
            const data = await api.get("rendimientos").json<PerformanceData[]>();
            setActions(data);
        }catch (err) {
            setError("No se pudo obtener las tablas");
            console.error(err);
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        fetchActions();
    }, [])

    return{
        actions, loading, error,
        refetch: fetchActions,
    };
}