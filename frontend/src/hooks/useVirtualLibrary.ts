import api from "../api/kyClient";
import type { VirtualDocument } from "../validations/virtualLibrarySchema";
import { presignedUrlPatch, presignedUrlPost } from "./presignedUrl";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";

interface PaginatedResponse {
    results: VirtualDocument[];
    count: number;
    next: string | null;
    previous: string | null;
    published_count: number;
    draft_count: number;
    archive_count?: number;
}

export function useVirtualLibrary(page: number = 1, search: string = '', category: string = 'all') {
    const {
        data,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ['virtual-library', page, search, category],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                ...(search && { search: search }),
                ...(category !== 'all' && { categoria: category }),
            });
            return api
                .get(`virtual_library/virtual_library/?${params.toString()}`)
                .json<PaginatedResponse>();
        },
        select: (data) => ({
            ...data,
            results: data.results.map((item) => {
                const pdfSource = item.pdf;
                let finalPdfUrl = undefined;
                if (typeof pdfSource === 'string') {
                    // Si ya es un string, asumimos que es la URL
                    finalPdfUrl = pdfSource;
                } else if (pdfSource && typeof pdfSource === 'object' && 'url' in pdfSource) {
                    // Si es un objeto con la propiedad url (típico de DRF)
                    finalPdfUrl = (pdfSource as any).url;
                }
                return {
                    ...item,
                    pdf_url: finalPdfUrl,
                    pdf: undefined,
                }
            }),
        }),
        placeholderData: keepPreviousData,
    });

    return {
        data: data?.results ?? [],
        next: data?.next,
        previous: data?.previous,
        count: data?.count ?? 0,
        isPending,
        isError,
        error,
    };
}

export function useVirtualLibraryAdmin(page: number = 1, search: string = '', category: string = 'all') {
    const {
        data,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ['virtual-library', 'admin', page, search, category],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                ...(search && { search: search }),
                ...(category !== 'all' && { categoria: category }),
            });
            return api
                .get(`virtual_library/virtual_library_admin/?${params.toString()}`)
                .json<PaginatedResponse>();
        },
        select: (data) => ({
            ...data,
            results: data.results.map((item) => {
                const pdfSource = item.pdf;
                let finalPdfUrl = undefined;
                if (typeof pdfSource === 'string') {
                    // Si ya es un string, asumimos que es la URL
                    finalPdfUrl = pdfSource;
                } else if (pdfSource && typeof pdfSource === 'object' && 'url' in pdfSource) {
                    // Si es un objeto con la propiedad url (típico de DRF)
                    finalPdfUrl = (pdfSource as any).url;
                }
                return {
                    ...item,
                    pdf_url: finalPdfUrl,
                    pdf: undefined,
                }
            }),
        }),
        placeholderData: keepPreviousData,
        enabled: search.trim().length > 3 || search.trim().length === 0,
    });

    return {
        data: data?.results ?? [],
        count: data?.count ?? 0,
        next: data?.next,
        previous: data?.previous,
        published_count: data?.published_count ?? 0,
        draft_count: data?.draft_count ?? 0,
        archived_count: data?.archive_count ?? 0,
        isPending,
        isError,
        error,
    };
}


export async function useVirtualLibraryDetailAdmin(id: number) {
    const data: { pdf_url: string, pdf: string } = {
        pdf_url: '',
        pdf: ''
    }

    const pdf_url_response = await api
        .get(`virtual_library/virtual_library_admin/${id}/pdf-download/`)
        .json<{ download_url: string, pdf_id: string }>();

    data.pdf_url = `${pdf_url_response.pdf_id}`;
    data.pdf = pdf_url_response.download_url;

    return data;
}

export function useVirtualLibraryPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: VirtualDocument) => {
            let finalPdfId: string | null = null;

            if (data.pdf) {
                finalPdfId = await presignedUrlPost(data.pdf);
            }
            console.log("Final PDF ID:", finalPdfId);

            const formData = new FormData();
            formData.append("titulo", data.titulo);
            formData.append("descripcion", data.descripcion);
            formData.append("autor", data.autor);
            formData.append("anio", data.anio);
            formData.append("categoria", data.categoria);
            formData.append("estado", data.estado);

            if (finalPdfId) formData.append("pdf", finalPdfId.toString());

            const response = await api.post(`virtual_library/virtual_library_admin/`, { body: formData });
            return response;
        },
        onSuccess: (_data) => {
            queryClient.invalidateQueries({ queryKey: ['virtual-library', 'admin'] });
            toast.success("Elemento creado exitosamente");
        },
        onError: (error) => {
            toast.error(`Error al crear el elemento: ${(error as Error)}`);
        }
    });
}

export function useVirtualLibraryPatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data, data_old }: { id: number, data: VirtualDocument, data_old: VirtualDocument }) => {
            let hasChanges = false;
            const formData = new FormData();

            const appendIfChanged = (key: string, newValue: any, oldValue: any) => {
                if (newValue !== oldValue) {
                    formData.append(key, newValue);
                    hasChanges = true;
                }
            };

            appendIfChanged("titulo", data.titulo, data_old.titulo);
            appendIfChanged("descripcion", data.descripcion, data_old.descripcion);
            appendIfChanged("autor", data.autor, data_old.autor);
            appendIfChanged("anio", data.anio, data_old.anio);
            appendIfChanged("categoria", data.categoria || '', data_old.categoria || '');
            appendIfChanged("estado", data.estado, data_old.estado);

            if (data.pdf !== data_old.pdf) {
                hasChanges = true;
                if (data_old.pdf_url) {
                    const uploadRes = await presignedUrlPatch(
                        data.pdf as File,
                        data_old.pdf_url as string
                    );
                    if (!uploadRes) {
                        throw new Error("Error al subir el PDF");
                    }
                } else {
                    const pdfId = await presignedUrlPost(data.pdf as File);
                    formData.append("pdf", pdfId);
                }
            }

            if (!hasChanges) {
                return { message: "Sin cambios en base de datos" };
            }

            const response = await api.patch(`virtual_library/virtual_library_admin/${id}/`, { body: formData });
            return response;
        },
        onSuccess: (_data: any) => {
            if (!_data.message) {
                queryClient.invalidateQueries({ queryKey: ['virtual-library', 'admin'] });
                toast.success("Elemento actualizado exitosamente");
            } else {
                toast.info("No se detectaron cambios para actualizar");
            }

        },
        onError: () => {
            toast.error("Error al actualizar el elemento");
        }
    });
}

export function useVirtualLibraryDelete() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            return await api.delete(`virtual_library/virtual_library_admin/${id}/`);
        },
        onSuccess: (_data) => {
            queryClient.invalidateQueries({ queryKey: ['virtual-library', 'admin'] });
            toast.success("Elemento eliminado exitosamente");
        },
        onError: () => {
            toast.error("Error al eliminar el elemento");
        },
        onMutate: () => {
            const toastId = toast.loading("Eliminando elemento...");
            return { toastId };
        },
        onSettled: (_data, _error, _variables, context) => {
            toast.dismiss(context?.toastId);
        }
    });
}