import { useState, useEffect } from "react";
import api from "../api/kyClient";
import type { GenericData } from "../validations/genericSchema";
import { presignedUrlPatch, presignedUrlPost } from "./presignedUrl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useItems(type: "yearbooks" | "regulation" | "announcements") {
  const [items, setItems] = useState<GenericData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async (type: "yearbooks" | "regulation" | "announcements") => {
    try {
      setLoading(true);
      const url = type === "announcements" ? "calls" : type

      const response: GenericData[] = await api.get(`${url}/${url}/`).json();

      setItems(response.results.map(item => ({
        ...item,
        pdf_url: item.pdf?.url,
        pdf: undefined,
      })));

    } catch (error) {
      console.error("Error obteniendo datos:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(type);
  }, [type]);

  return { items, loading, refetchItems: () => fetchItems(type) };
}

export function useItemsAdmin(type: "yearbooks" | "regulation" | "announcements") {
  const [items, setItems] = useState<GenericData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async (type: "yearbooks" | "regulation" | "announcements") => {
    try {
      setLoading(true);
      const url = type === "announcements" ? "calls" : type

      const response: GenericData[] = await api.get(`${url}/${url}_admin/`).json();

      setItems(response.results.map(item => ({
        ...item,
        pdf_url: item.pdf?.url,
        pdf: undefined,
      })));

    } catch (error) {
      console.error("Error obteniendo datos:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(type);
  }, [type]);

  return { items, loading, refetchItems: () => fetchItems(type) };
}

export async function useItemDetailAdmin(id: number, type: "yearbooks" | "regulation" | "announcements") {
  const data: { pdf_url: string, pdf: string } = {
    pdf_url: '',
    pdf: ''
  }
  const url = type === "announcements" ? "calls" : type

  const pdf_url_response = await api
    .get(`${url}/${url}_admin/${id}/pdf-download/`)
    .json<{ download_url: string, pdf_id: string }>();

  data.pdf_url = `${pdf_url_response.pdf_id}`;
  data.pdf = pdf_url_response.download_url;

  return data;
}

export function useItemPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, type }: { data: GenericData, type: "yearbooks" | "regulation" | "announcements" }) => {
      const endpoint = type === "announcements" ? "calls" : type;
      let finalPdfId: string | null = null;

      if (data.pdf) {
        finalPdfId = await presignedUrlPost(data.pdf);
      }

      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("descripcion", data.descripcion);
      formData.append("estado", data.estado);

      if (type !== "announcements") {
        formData.append("fecha_publicacion", data.fecha_publicacion);
      }

      if (finalPdfId) formData.append("pdf", finalPdfId.toString());

      const response = await api.post(`${endpoint}/${endpoint}_admin/`, { body: formData });
      return response;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.type + "_admin"] });
      toast.success("Elemento creado exitosamente");
    },
    onError: () => {
      toast.error("Error al crear el elemento");
    }
  });
}

export function useItemPatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data, data_old, type }: { id: number, data: GenericData, data_old: GenericData, type: "yearbooks" | "regulation" | "announcements" }) => {
      const endpoint = type === "announcements" ? "calls" : type;
      let hasChanges = false;
      const formData = new FormData();

      const appendIfChanged = (key: string, newValue: any, oldValue: any) => {
        if (newValue !== oldValue) {
          formData.append(key, newValue);
          hasChanges = true;
        }
      };

      appendIfChanged("nombre", data.nombre, data_old.nombre);
      appendIfChanged("descripcion", data.descripcion, data_old.descripcion);
      appendIfChanged("estado", data.estado, data_old.estado);
      appendIfChanged("fecha_publicacion", data.fecha_publicacion, data_old.fecha_publicacion);

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

      const response = await api.patch(`${endpoint}/${endpoint}_admin/${id}/`, { body: formData });
      return response;
    },
    onSuccess: (_data: any, variables) => {
      if (!_data.message) {
        queryClient.invalidateQueries({ queryKey: [variables.type + "_admin"] });
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

export function useItemDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, type }: { id: number, type: "yearbooks" | "regulation" | "announcements" }) => {
      const endpoint = type === "announcements" ? "calls" : type;
      return await api.delete(`${endpoint}/${endpoint}_admin/${id}/`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.type + "_admin"] });
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