import api from "../api/kyClient";
import type { Incidencia, ListaCategorias } from "../validations/adminArancelesSchema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function useIncidencias() {
    return useQuery({
        queryKey: ['admin', 'incidencias'],
        queryFn: () => api.get("aranceles/incidencias-admin/").json<Incidencia[]>(),
        select: (data) => {
            return data.reduce((acc, i) => {
                const parts = i.nombre.split('_');
                const code = parts[0];
                let name = parts.slice(1).join('_');

                if (!acc[code] && code !== 'ant') {
                    acc[code] = [];
                }

                if (code === 'ant') {
                    if (!acc.ant) acc.ant = [];
                    const nivel = parts[1];
                    const campo = parts.slice(2).join('_');
                    let nivelExistente = acc[code].find((item: any) => item.nombre === nivel) as { nombre: string; valores: Record<string, { id: number; valor: number }> } | undefined;

                    if (!nivelExistente) {
                        // Si no existe, lo creamos
                        nivelExistente = {
                            nombre: nivel,
                            valores: {} as Record<string, { id: number; valor: number }>
                        };
                        acc.ant.push(nivelExistente);
                    }

                    // Agregamos el valor al objeto 'valores'
                    // Usamos parseFloat porque en JSON los valores vienen como strings ("1.80000")
                    nivelExistente.valores[campo] = { id: i.id, valor: parseFloat(i.valor.toString()) };
                }

                else if (code === 'ipc' && parts[1] === 'nacional') {
                    acc.ipc_nacional = acc.ipc_nacional || [];
                    acc.ipc_nacional.push({
                        id: i.id,
                        nombre: name,
                        valor: parseFloat(i.valor.toString()),
                    });
                }

                else if (code === 'fce' || code === 'ipc') {
                    if (!acc.departamentos) acc.departamentos = [];

                    // El nombre del departamento es lo que viene después del primer '_'
                    const nombreDepto = parts.slice(1).join('_');

                    let deptoExistente = acc.departamentos.find((d: any) => d.nombre === nombreDepto);

                    if (!deptoExistente) {
                        deptoExistente = { id_fce: 0, id_ipc: 0, nombre: nombreDepto, fce: 0, ipc: 0 };
                        acc.departamentos.push(deptoExistente);
                    }

                    // Asignamos el valor a la propiedad correspondiente (fce o ipc)
                    deptoExistente[code] = parseFloat(i.valor.toString());
                    deptoExistente[code === 'fce' ? 'id_fce' : 'id_ipc'] = i.id;
                }

                else {
                    acc[code].push({
                        id: i.id,
                        nombre: name,
                        valor: parseFloat(i.valor.toString()),
                    });
                }
                return acc;
            }, {} as Record<string, any>);
        }
    });
}

export function useCategoriasAranceles() {
    return useQuery({
        queryKey: ['admin', 'categorias'],
        queryFn: () => api.get("aranceles/categorias-admin/").json<ListaCategorias>(),
    });
}

export function useAdminAranceles() {
    const categoriasQuery = useCategoriasAranceles();
    const incidenciasQuery = useIncidencias();

    return {
        aranceles: categoriasQuery.data,
        incidenciasClean: incidenciasQuery.data,
        // Combinamos estados para la UI principal
        isPending: categoriasQuery.isPending || incidenciasQuery.isPending,
        isError: categoriasQuery.isError || incidenciasQuery.isError,
        // Pero permitimos saber cuál falló si es necesario
        errorCategorias: categoriasQuery.isError,
        errorIncidencias: incidenciasQuery.isError,
    };
}

export function useAdminIncidenciasPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post(`aranceles/incidencias-admin/`, { json: data });
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'incidencias'] });
            toast.success("Incidencias creadas exitosamente");
        },
        onError: () => {
            toast.error("Error al crear las incidencias");
        }
    });
}

export function useAdminIncidenciasPatch() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ oldData, data }: { oldData: any[]; data: any }) => {
            const updatedIncidencias = data.map((item: any) => {
                const formData: Record<string, any> = {};
                let hasChanges = false;
                const appendIfChanged = (key: string, newValue: any, oldValue: any) => {
                    if (newValue !== oldValue) {
                        formData[key] = newValue;
                        hasChanges = true;
                    }
                };
                const oldItem = oldData.find((i) => i.id === item.id);
                appendIfChanged('nombre', item.nombre, oldItem.nombre);
                appendIfChanged('valor', item.valor, oldItem.valor);
                if (hasChanges) {
                    formData.id = item.id;
                }
                if (!hasChanges) {
                    return null;
                }
                return formData;
            }).filter((item: any) => item !== null);
            if (updatedIncidencias.length === 0) {
                return { message: "Sin cambios en base de datos" };
            }
            const response = await api.patch(`aranceles/incidencias-admin/bulk-update/`, { json: updatedIncidencias });
            return response.json();
        },
        onSuccess: (_data: any) => {
            if (_data.message) {
                toast.info("No se realizaron cambios");
                return;
            }
            queryClient.invalidateQueries({ queryKey: ['admin', 'incidencias'] });
            toast.success("Incidencias actualizadas exitosamente");
        },
        onError: () => {
            toast.error("Error al actualizar la incidencia");
        }
    });
}

export function useAdminIncidenciasDelete() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await api.delete(`aranceles/incidencias-admin/${id}/`);
            return response.status === 204;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'incidencias'] });
            toast.success("Incidencia eliminada exitosamente");
        },
        onError: () => {
            toast.error("Error al eliminar la incidencia");
        }
    });
}

export function useAdminCategoriasPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post(`aranceles/categorias-admin/`, { json: data });
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categorias'] });
            toast.success("Categoría creada exitosamente");
        },
        onError: () => {
            toast.error("Error al crear la categoría");
        }
    });
}

export function useAdminCategoriasPatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ catId, data }: { catId: number; data: any }) => {
            const response = await api.patch(`aranceles/categorias-admin/${catId}/`, { json: data });
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categorias'] });
            toast.success("Ítem guardado exitosamente");
        },
    });
}

export function useAdminCategoriasDelete() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await api.delete(`aranceles/categorias-admin/${id}/`);
            return response.status === 204;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categorias'] });
            toast.success("Categoría eliminada exitosamente");
        },
        onError: () => {
            toast.error("Error al eliminar la categoría");
        }
    });
}