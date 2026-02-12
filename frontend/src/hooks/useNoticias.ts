import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import api from '../api/kyClient';
import { type NewsData } from "../validations/newsSchema";
import { presignedUrlPost, presignedUrlPatch } from "./presignedUrl";
//Anadimos esto Paginacion
type PaginatedResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NewsData[];
};
//Aumentamos funciones para paginacion en admin
export function useNoticiasAdmin(page: number) {
  const {
    data,
    isPending,
    isError,
    error
  } = useQuery({
    queryKey: ['noticias', 'admin', page],
    queryFn: async () => {
      return api
        .get(`news/news_admin/?page=${page}`)
        .json<PaginatedResponse>();
      //const res = await api.get("news/news_admin/").json<{ results: NewsData[] }>();
      //return res.results;
    },
    placeholderData: keepPreviousData,
  });

  // Retornamos un array vacío por defecto si es undefined para evitar crash en el .map del UI
  //Anadimos funciones para la paginacion en admin
  return {
    noticias: data?.results ?? [],
    count: data?.count ?? 0,
    next: data?.next,
    previous: data?.previous,
    isPending,
    isError,
    error,
  };
}
//Cambiamos esto para la Paginacion
export function useNoticias(page: number, search: string = '', category: string = '') {
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['noticias_users', page, search, category],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search && { search: search }),
        ...(category !== "all" && { categoria: category }),
      });
      return api
        .get(`news/news/?${params.toString()}`)
        .json<PaginatedResponse>();
    },
    select: (data) => ({
      ...data,
      results: data.results.map((item) => ({
        ...item,
        imagen_url: item.imagen?.url,
        imagen: undefined,
      })),
    }),
    placeholderData: keepPreviousData,
    enabled: search.trim().length > 4 || search.trim().length === 0,
  });

  return {
    noticias: data?.results ?? [],
    count: data?.count ?? 0,
    next: data?.next,
    previous: data?.previous,
    isLoading,
    isError,
    error
  };
}

export async function useNoticiaDetailAdmin(id?: string) {
  const data: NewsData = await api.get(`news/news_admin/${id}/`).json();
  if (data.pdf) {
    const pdf_url_response = await api
      .get(`news/news/${data.id}/pdf-download/`)
      .json<{ download_url: string, pdf_id: string }>();
    data.pdf_url = `${pdf_url_response.pdf_id}`;
    data.pdf = pdf_url_response.download_url;
  }
  if (data.imagen) {
    const img_url_response = await api
      .get(`news/news/${data.id}/img-download/`)
      .json<{ download_url: string, img_id: string }>();
    data.imagen_url = `${img_url_response.img_id}`;
    data.imagen = img_url_response.download_url;
  }
  return data;
}

export function useNoticiaDetail(id?: string) {
  const fetchNoticias = async () => {
    const data: NewsData = await api.get(`news/news/${id}/`).json();
    if (data.pdf) {
      const pdf_url_response = await api
        .get(`news/news/${data.id}/pdf-download/`)
        .json<{ download_url: string }>();
      data.pdf_url = pdf_url_response.download_url;
    }
    if (data.imagen) {
      const img_url_response = await api
        .get(`news/news/${data.id}/img-download/`)
        .json<{ download_url: string }>();
      data.imagen_url = img_url_response.download_url;
    }
    return data;
  };

  const { data: noticia, isLoading: loading, isError, error } = useQuery({
    // CAMBIO: Se agregó el sufijo _users
    queryKey: ['noticia_users', id],
    queryFn: fetchNoticias,
    enabled: !!id,
  });

  return { noticia, loading, isError, error };
}
export function useNewsPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NewsData) => {
      let pdf_id: string | null = null;
      let img_id: string | null = null;

      // Subir PDF si existe
      if (data.pdf) {
        pdf_id = await presignedUrlPost(data.pdf);
      }
      // Subir Imagen si existe
      if (data.imagen) {
        img_id = await presignedUrlPost(data.imagen);
      }
      // Crear FormData
      const formData = new FormData();
      formData.append("titulo", data.titulo);
      formData.append("categoria", data.categoria);
      formData.append("resumen", data.resumen);
      formData.append("descripcion", data.descripcion);
      formData.append("estado", data.estado);
      // Archivos opcionales
      if (img_id) {
        formData.append("imagen", img_id);
      }
      if (pdf_id) {
        formData.append("pdf", pdf_id);
      }

      const response = await api.post("news/news_admin/", {
        body: formData,
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("Noticia creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ['noticias', 'admin'] });
    },
    onError: () => {
      toast.error("Error al crear la noticia");
    },
  });
}

export function useNewsPatch() {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      data_old
    }: {
      id: string;
      data: NewsData;
      data_old: NewsData;
    }) => {
      const formData = new FormData();
      let hasChanges = false;

      const appendIfChanged = (key: string, newValue: any, oldValue: any) => {
        if (newValue !== oldValue) {
          formData.append(key, newValue);
          hasChanges = true;
        }
      };

      appendIfChanged("titulo", data.titulo, data_old.titulo);
      appendIfChanged("categoria", data.categoria, data_old.categoria);
      appendIfChanged("resumen", data.resumen, data_old.resumen);
      appendIfChanged("descripcion", data.descripcion, data_old.descripcion);
      appendIfChanged("estado", data.estado, data_old.estado);

      // Manejo de la imagen
      if (data.imagen !== data_old.imagen) {

        if (data_old.imagen_url) {
          // Actualizar imagen existente
          const uploadRes = await presignedUrlPatch(
            data.imagen as File,
            data_old.imagen_url as string
          );
          if (!uploadRes) {
            throw new Error("Error al subir la imagen");
          }
        } else {
          // Nueva imagen
          const imgId = await presignedUrlPost(data.imagen as File);
          formData.append("imagen", imgId);
        }
        hasChanges = true;
      }
      console.log("PDFs comparados:", data.pdf, data_old.pdf);
      console.log("URLs comparados:", data.pdf_url, data_old.pdf_url);
      // Manejo del PDF
      if (data.pdf !== data_old.pdf) {
        if (data_old.pdf_url) {
          // Actualizar PDF existente
          if (data.pdf === null) {
            // Eliminar PDF
            const deleteRes = await presignedUrlPatch(
              data_old.pdf as string,
              data_old.pdf_url as string,
              "delete"
            );
            if (!deleteRes) {
              throw new Error("Error al eliminar el PDF");
            }
            return "PDF eliminado correctamente";
          }
          const uploadRes = await presignedUrlPatch(
            data.pdf as File,
            data_old.pdf_url as string
          );
          if (!uploadRes) {
            throw new Error("Error al subir el PDF");
          }
        } else {
          // Nuevo PDF
          const pdfId = await presignedUrlPost(data.pdf as File);
          formData.append("pdf", pdfId);
        }
        hasChanges = true;
      }

      if (!hasChanges) {
        return null;
      }

      const response = await api.patch(`news/news_admin/${id}/`, {
        body: formData,
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success("Noticia actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ['noticias', 'admin'] });
    },
    onError: () => {
      toast.error("Error al actualizar la noticia");
    },
  });
}

export function useNewsDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`news/news_admin/${id}/`);
      return response.status === 204;
    },
    onSuccess: () => {
      toast.success("Noticia eliminada exitosamente");
      queryClient.invalidateQueries({ queryKey: ['noticias', 'admin'] });
    },
    onError: () => {
      toast.error("Error al eliminar la noticia");
    },
    onMutate: () => {
      const toastId = toast.loading("Eliminando noticia...");
      return { toastId };
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
    },
  });
}