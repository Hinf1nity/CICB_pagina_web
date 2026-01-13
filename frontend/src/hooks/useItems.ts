import { useState, useEffect } from "react";
import api from "../api/kyClient";
import type { GenericData } from "../validations/genericSchema";

export function useItems(type: "yearbooks" | "regulation" | "announcements") {
  const [items, setItems] = useState<GenericData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async (type: "yearbooks" | "regulation" | "announcements") => {
    const endpoint = type === "announcements" ? "calls" : type;
    try {
      setLoading(true);
      const response: GenericData[] = await api.get(`${endpoint}/`).json();
      setItems(response);
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

export function useItemPost() {
  const postItem = async (data: GenericData, type: "yearbooks" | "regulation" | "announcements") => {
    const endpoint = type === "announcements" ? "calls" : type;
    let finalPdfId = null;

    if ((type === "yearbooks" || type === "announcements") && data.pdf instanceof File) {
      const presignedData: any = await api.post("pdfs/pdf-presigned-url/", {
        json: {
          file_name: data.pdf.name,
          content_type: data.pdf.type
        }
      }).json();

      const { upload_url, pdf_id } = presignedData;

      await fetch(upload_url, {
        method: "PUT",
        body: data.pdf,
        headers: { "Content-Type": "application/pdf" }
      });

      finalPdfId = pdf_id;
    }

    const formData = new FormData();
    formData.append("nombre", data.nombre);
    formData.append("descripcion", data.descripcion);
    formData.append("estado", data.estado);

    if (type !== "announcements") {
      formData.append("fecha_publicacion", data.fecha_publicacion);
    }

    if (type === "yearbooks" || type === "announcements") {
      if (finalPdfId) formData.append("pdf", finalPdfId.toString());
    } else {
      if (data.pdf instanceof File) {
        formData.append("pdf_url", data.pdf);
      }
    }

    return await api.post(`${endpoint}/`, { body: formData });
  };

  return { postItem };
}

export function useItemPatch() {
  const patchItem = async (id: number, data: GenericData, old_data: GenericData, type: "yearbooks" | "regulation" | "announcements") => {
    const endpoint = type === "announcements" ? "calls" : type;

    if (type === "yearbooks" && data.pdf instanceof File && data.pdf !== old_data.pdf) {
      const presignedData: any = await api.patch(`pdfs/${id}/pdf-presigned-update/`, {
        json: { content_type: "application/pdf" }
      }).json();

      await fetch(presignedData.upload_url, {
        method: "PUT",
        body: data.pdf,
        headers: { "Content-Type": "application/pdf" }
      });
    }

    const formData = new FormData();
    if (data.nombre !== old_data.nombre) formData.append("nombre", data.nombre);
    if (data.descripcion !== old_data.descripcion) formData.append("descripcion", data.descripcion);
    if (data.estado !== old_data.estado) formData.append("estado", data.estado);
    
    if (type !== "announcements" && data.fecha_publicacion !== old_data.fecha_publicacion) {
        formData.append("fecha_publicacion", data.fecha_publicacion);
    }

    if (data.pdf !== old_data.pdf) {
      if (type !== "yearbooks" && data.pdf instanceof File) {
        formData.append("pdf_url", data.pdf);
      }
    }

    return await api.patch(`${endpoint}/${id}/`, { body: formData });
  };
  return { patchItem };
}

export function useItemDelete() {
  const deleteItem = async (id: number, type: "yearbooks" | "regulation" | "announcements") => {
    const endpoint = type === "announcements" ? "calls" : type;
    return await api.delete(`${endpoint}/${id}/`);
  };
  return { deleteItem };
}