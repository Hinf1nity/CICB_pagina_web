import { useEffect, useState } from "react";
import api from "../api/kyClient";
import { type PerformanceData, type Recurso } from "../validations/performanceSchema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";

export function usePerformancePost() {
    const postPerformance = async (data: PerformanceData) => {
        console.log(data);
        await api.post("performance/performance/", {
            json: {
                codigo: data.codigo,
                unidad: data.unidad,
                actividad: data.actividad,
                categoria: data.categoria,
                recursos_info: data.recursos_info,
            }
        }).json();
    };

    return { postPerformance };
}

export function useResourcesPost() {
    const postResource = async (data: Recurso) => {
        const formData = new FormData();
        console.log(data);
        // return await api.post("performance/resources/", { body: formData }).json();
    };

    return { postResource };
}

export function usePerformance() {
    const [actions, setActions] = useState<PerformanceData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetchActions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.get("performance/performance/").json<PerformanceData[]>();
            setActions(data);
        } catch (err) {
            setError("No se pudo obtener las tablas");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActions();
    }, [])

    return {
        actions, loading, error,
        refetch: fetchActions,
    };
}

export function useResources() {
    const [resources, setResources] = useState<Recurso[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetchResources = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.get("performance/resources/").json<Recurso[]>();
            setResources(data);
        } catch (err) {
            setError("No se pudo obtener los recursos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [])

    return {
        resources, loading, error,
        refetch: fetchResources,
    };
}

export function usePerformancePatch() {
    const patchPerformance = async (id: string, data: PerformanceData) => {
        const formData = new FormData();
        formData.append("codigo", data.codigo);
        formData.append("unidad", data.unidad);
        formData.append("actividad", data.actividad);
        formData.append("categoria", data.categoria);
        formData.append("recursos_info", JSON.stringify(data.recursos_info));

        return await api.patch(`performance/performance_admin/${id}/`, { body: formData }).json();
    };

    return { patchPerformance };
}

export function usePerformanceDelete() {
    const deletePerformance = async (id: string) => {
        await api.delete(`performance/performance_admin/${id}/`);
    };

    return { deletePerformance };
}

export function searchResourceByName(query: string) {
    const [debouncedSearch] = useDebounce(query, 300);
    const { data, isLoading, isError } = useQuery({
        queryKey: ['resources', debouncedSearch],
        queryFn: async () => {
            const data: Recurso[] = await api.get(`performance/resources/`, {
                searchParams: { debouncedSearch },
            }).json();
            console.log(data);
            return data
        },
        enabled: debouncedSearch.trim().length > 2,
    });

    return { resources: data || [], isLoading, isError };
}