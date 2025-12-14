import { useEffect, useState} from "react";
import api from "../api/kyClient";

interface Resource {
    id:string;
    name:string;
    unit:string;
    quantity: number;
}

interface Action {
    id:string;
    code:string;
    description:string;
    unit:string;
    category:string;
    resources:Resource[];
}

export function useActions(){
    const[actions, setActions] = useState<Action[]>([]);
    const[loading, setLoading] = useState<boolean>(true);
    const[error, setError] = useState<string | null>(null);
    const fetchActions = async() => {
        try{
            setLoading(true);
            setError(null);
            const data = await api.get("actions").json<Action[]>();
            setActions(data);
        }catch (err: any) {
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