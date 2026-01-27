import api from "../api/kyClient";
import { type PerformanceData, type Recurso } from "../validations/performanceSchema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";

export function usePerformancePost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: PerformanceData) => {
            console.log(data);
            return await api.post("performance/performance/", {
                json: {
                    codigo: data.codigo,
                    unidad: data.unidad,
                    actividad: data.actividad,
                    categoria: data.categoria,
                    recursos_info: data.recursos_info,
                }
            }).json();
        },
        onSuccess: () => {
            toast.success("Tabla de rendimiento creada correctamente.");
            queryClient.invalidateQueries({ queryKey: ['performance'] });
        },
        onError: () => {
            toast.error("Error al crear la tabla de rendimiento.");
        }
    });
}

export function useResourcesPost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Recurso) => {
            const formData = new FormData();
            formData.append("nombre", data.nombre);
            formData.append("unidad", data.unidad);
            return await api.post("performance/resources/", { body: formData }).json();
        },
        onSuccess: () => {
            toast.success("Recurso creado correctamente.");
            queryClient.invalidateQueries({ queryKey: ['resources'] });
        },
        onError: () => {
            toast.error("Error al crear el recurso.");
        }
    });
}

export function usePerformance() {
    const {
        data: actions, isLoading: loading,
        error,
    } = useQuery({
        queryKey: ['performance'],
        queryFn: async () => {
            const data = await api.get("performance/performance/").json<{
                results: PerformanceData[];
            }>();
            return data.results;
        },
    });

    return {
        actions: actions || [],
        loading,
        error: error ? "No se pudo obtener las tablas" : null,
    };
}

export function useResources() {
    const {
        data: resources,
        isLoading: loading,
        error,
    } = useQuery({
        queryKey: ['resources'],
        queryFn: async () => {
            const data = await api.get("performance/resources/").json<{
                results: Recurso[];
            }>();
            return data.results;
        },
    });

    return {
        resources: resources || [],
        loading,
        error: error ? "No se pudo obtener los recursos" : null,
    };
}

export function usePerformancePatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data, oldData }: { id: string, data: PerformanceData, oldData: PerformanceData }) => {
            let hasChanges = false;
            const formData: Record<string, any> = {};
            const appendIfChanged = (key: string, newValue: any, oldValue: any) => {
                if (newValue !== oldValue) {
                    formData[key] = newValue;
                    hasChanges = true;
                }
            }
            appendIfChanged("codigo", data.codigo, oldData.codigo);
            appendIfChanged("unidad", data.unidad, oldData.unidad);
            appendIfChanged("actividad", data.actividad, oldData.actividad);
            appendIfChanged("categoria", data.categoria, oldData.categoria);
            if (JSON.stringify(data.recursos_info) !== JSON.stringify(oldData.recursos_info)) {
                formData.recursos_info = data.recursos_info;
                hasChanges = true;
            }
            if (!hasChanges) {
                return { message: "Sin cambios en base de datos" };
            }
            console.log("Patching with data:", formData);
            return await api.patch(`performance/performance/${id}/`, { json: formData }).json();
        },
        onSuccess: (_data: any) => {
            if (_data.message === "Sin cambios en base de datos") {
                toast.info("No hay cambios para guardar.");
                return;
            }
            toast.success("Tabla de rendimiento actualizada correctamente.");
            queryClient.invalidateQueries({ queryKey: ['performance'] });
        },
        onError: () => {
            toast.error("Error al actualizar la tabla de rendimiento.");
        }
    });
}

export function useResourcesPatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data, oldData }: { id: string, data: Recurso, oldData: Recurso }) => {
            let hasChanges = false;
            const formData = new FormData();
            const appendIfChanged = (key: string, newValue: any, oldValue: any) => {
                if (newValue !== oldValue) {
                    formData.append(key, newValue);
                    hasChanges = true;
                }
            };
            appendIfChanged("nombre", data.nombre, oldData.nombre);
            appendIfChanged("unidad", data.unidad, oldData.unidad);
            if (!hasChanges) {
                return { message: "Sin cambios en base de datos" };
            }
            return await api.patch(`performance/resources/${id}/`, { body: formData }).json();
        },
        onSuccess: (_data: any) => {
            if (_data.message === "Sin cambios en base de datos") {
                toast.info("No hay cambios para guardar.");
                return;
            }
            toast.success("Recurso actualizado correctamente.");
            queryClient.invalidateQueries({ queryKey: ['resources'] });
        },
        onError: () => {
            toast.error("Error al actualizar el recurso.");
        }
    });
}

export function usePerformanceDelete() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`performance/performance/${id}/`);
        },
        onSuccess: () => {
            toast.success("Tabla de rendimiento eliminada exitosamente");
            queryClient.invalidateQueries({ queryKey: ['performance'] });
        },
        onError: () => {
            toast.error("Error al eliminar la tabla de rendimiento");
        },
        onMutate: () => {
            const toastId = toast.loading("Eliminando tabla de rendimiento...");
            return { toastId };
        },
        onSettled: (_data, _error, _variables, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
        },
    });
}

export function useResourcesDelete() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`performance/resources/${id}/`);
        },
        onSuccess: () => {
            toast.success("Recurso eliminado exitosamente");
            queryClient.invalidateQueries({ queryKey: ['resources'] });
        },
        onError: () => {
            toast.error("Error al eliminar el recurso");
        },
        onMutate: () => {
            const toastId = toast.loading("Eliminando recurso...");
            return { toastId };
        },
        onSettled: (_data, _error, _variables, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
        },
    });
}

export function searchResourceByName(query: string) {
    const [search] = useDebounce(query, 300);
    const { data, isLoading, isError } = useQuery({
        queryKey: ['resources', search],
        queryFn: async () => {
            const data: Recurso[] = await api.get(`performance/resources/`, {
                searchParams: { search: search },
            }).json();
            console.log(data.results);
            return data.results;
        },
        enabled: search.trim().length > 2,
    });

    return { resources: data || [], isLoading, isError };
}