import { useState, useEffect } from "react";
import api from "../api/kyClient";
import type { GenericData } from "../validations/genericSchema";
import { presignedUrlPatch, presignedUrlPost } from "./presignedUrl";

export function useItems(type: "yearbooks" | "regulation" | "announcements") {
  const [items, setItems] = useState<GenericData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async (type: "yearbooks" | "regulation" | "announcements") => {
    try {
      setLoading(true);
      const url = type === "announcements" ? "calls" : type

      const response: GenericData[] = await api.get(`${url}/${url}/`).json();

      setItems(response.map(item => ({
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

      setItems(response.map(item => ({
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
  const postItem = async (data: GenericData, type: "yearbooks" | "regulation" | "announcements") => {
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

    return await api.post(`${endpoint}/${endpoint}_admin/`, { body: formData });
  };

  return { postItem };
}

export function useItemPatch() {
  const patchItem = async (id: number, data: GenericData, old_data: GenericData, type: "yearbooks" | "regulation" | "announcements") => {
    const endpoint = type === "announcements" ? "calls" : type;
    let hasChanges = false;

    const appendIfChanged = (key: string, value: any) => {
      formData.append(key, value);
      hasChanges = true;
    };

    const formData = new FormData();
    if (data.nombre !== old_data.nombre) appendIfChanged("nombre", data.nombre);
    if (data.descripcion !== old_data.descripcion) appendIfChanged("descripcion", data.descripcion);
    if (data.estado !== old_data.estado) appendIfChanged("estado", data.estado);

    if (type !== "announcements" && data.fecha_publicacion !== old_data.fecha_publicacion) {
      appendIfChanged("fecha_publicacion", data.fecha_publicacion);
    }

    if (data.pdf !== old_data.pdf) {
      hasChanges = true;
      if (old_data.pdf_url) {
        const uploadRes = await presignedUrlPatch(
          data.pdf as File,
          old_data.pdf_url as string
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
      return null;
    }
    const response = await api.patch(`${endpoint}/${endpoint}_admin/${id}/`, { body: formData });
    return response.json;
  };
  return { patchItem };
}

export function useItemDelete() {
  const deleteItem = async (id: number, type: "yearbooks" | "regulation" | "announcements") => {
    const endpoint = type === "announcements" ? "calls" : type;
    return await api.delete(`${endpoint}/${endpoint}_admin/${id}/`);
  };
  return { deleteItem };
}