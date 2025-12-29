import { useState, useEffect } from "react";
import api from "../api/kyClient";
import type { GenericData } from "../validations/genericSchema";

export function useItems(type: "yearbooks" | "regulation" | "announcements") {
  const [items, setItems] = useState<GenericData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async (type: "yearbooks" | "regulation" | "announcements") => {
    try {
      setLoading(true);

      const response: GenericData[] = await api.get(`${type}/`).json();

      setItems(response)

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
    // Crear FormData
    const formData = new FormData();
    formData.append("nombre", data.nombre);
    formData.append("descripcion", data.descripcion);
    formData.append("fecha_publicacion", data.fecha_publicacion);
    // Archivos opcionales
    if (data.pdf instanceof File) {
      formData.append("pdf_url", data.pdf);
    }
    formData.append("estado", data.estado);

    // Enviar solicitud POST
    const response = await api.post(`${type}/`, {
      body: formData,
    });
    return response;
  };

  return { postItem };
}

export function useItemPatch() {
  const patchItem = async (id: number, data: GenericData, old_data: GenericData, type: "yearbooks" | "regulation" | "announcements") => {
    // Crear FormData
    const formData = new FormData();
    if (data.nombre !== old_data.nombre) {
      formData.append("nombre", data.nombre);
    }
    if (data.descripcion !== old_data.descripcion) {
      formData.append("descripcion", data.descripcion);
    }
    if (data.fecha_publicacion !== old_data.fecha_publicacion) {
      formData.append("fecha_publicacion", data.fecha_publicacion);
    }
    if (data.pdf !== old_data.pdf) {
      formData.append("pdf", data.pdf);
    }
    if (data.estado !== old_data.estado) {
      formData.append("estado", data.estado);
    }
    // Enviar solicitud PATCH
    const response = await api.patch(`${type}/${id}/`, {
      body: formData,
    });
    return response;
  };
  return { patchItem };
}

export function useItemDelete() {
  const deleteItem = async (id: number, type: "yearbooks" | "regulation" | "announcements") => {
    // Enviar solicitud DELETE
    const response = await api.delete(`${type}/${id}/`);
    return response;
  };
  return { deleteItem };
}