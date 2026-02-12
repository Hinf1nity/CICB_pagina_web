import { HTTPError } from 'ky';
import api from '../api/kyClient';
import { type UserData } from '../validations/userSchema';
import { presignedUrlPost, presignedUrlPatch } from "./presignedUrl";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";

interface PaginatedResponse {
  results: UserData[];
  count: number;
  next: string | null;
  previous: string | null;
}

export function useUsersAdmin(page: number = 1, search: string = '', state: string = '') {
  const token = localStorage.getItem("access");
  const {
    data,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['users', 'admin', page, search, state, token],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search && { search: search }),
        ...(state !== "all" && { estado: state }),
      });
      const data: PaginatedResponse = await api.get(`users/?${params.toString()}`).json();
      return data;
    },
    placeholderData: keepPreviousData,
    enabled: !!token && (search.trim().length > 4 || search.trim().length === 0),
  });
  return {
    users: data?.results ?? [],
    count: data?.count ?? 0,
    next: data?.next,
    previous: data?.previous,
    isLoading,
    isSearching: isFetching && search !== '',
    error,
  };
}

export async function useUsersDetailAdmin(id: number) {
  const data: UserData = await api.get(`users/${id}/`).json();
  if (data.imagen) {
    const imageDataRes = await api.get(`users/${data.id}/img-download/`)
      .json<{ download_url: string, img_id: string }>();
    data.imagen_url = `${imageDataRes.img_id}`;
    data.imagen = imageDataRes.download_url;
  } else {
    data.imagen = undefined;
  }

  return data;
}

export async function useUsersDetailCard(id: number) {
  const data: UserData = await api.get(`users/details/${id}/`).json();
  if (data.imagen) {
    const imageDataRes = await api.get(`users/${data.id}/img-download/`)
      .json<{ download_url: string, img_id: string }>();
    data.imagen_url = `${imageDataRes.img_id}`;
    data.imagen = imageDataRes.download_url;
  }

  return data;
}

export function useUserProfileQuery(userId?: string) {
  return useQuery({
    queryKey: ['user-profile', userId],
    // 1. Fetch básico
    queryFn: async () => {
      const data: UserData = await api.get(`users/${userId}/`).json();
      if (data.imagen) {
        const imageDataRes = await api.get(`users/${data.id}/img-download/`)
          .json<{ download_url: string, img_id: string }>();
        data.imagen_url = `${imageDataRes.img_id}`;
        data.imagen = imageDataRes.download_url;
      }
      return data;
    },
    // 2. Solo se ejecuta si hay userId
    enabled: !!userId,
    // 3. Transformación de datos (Tu lógica compleja va aquí)
    select: (data) => {
      // Lógica de años
      const yearsDifference = new Date().getFullYear() - new Date(data.fecha_inscripcion).getFullYear();
      const hasPassedAniversary = (new Date().getMonth() > new Date(data.fecha_inscripcion).getMonth()) ||
        (new Date().getMonth() === new Date(data.fecha_inscripcion).getMonth() && new Date().getDate() >= new Date(data.fecha_inscripcion).getDate());
      const experienceYears = hasPassedAniversary ? yearsDifference : yearsDifference - 1;
      // Formateo de UI (Lo que muestras en las tarjetas)
      const uiData = {
        id: data.id?.toString() || '',
        name: data.nombre,
        rni: data.rni.toString(),
        rnic: data.rnic,
        specialty: `Ing. ${data.especialidad.charAt(0).toUpperCase() + data.especialidad.slice(1).toLowerCase()}` || 'No especificada',
        city: data.departamento || 'No especificada',
        registrationDate: data.fecha_inscripcion,
        status: data.estado?.charAt(0).toUpperCase() + data.estado?.slice(1).toLowerCase(),
        statusLaboral: data.registro_empleado ? data.registro_empleado.charAt(0).toUpperCase() +
          data.registro_empleado.slice(1).toLowerCase() : 'No especificado',
        experienceYears: experienceYears,
        photoUrl: data.imagen || '', // Simplificado
        certifications: data.certificaciones?.map((cert: any) => ({
          nombre: cert.nombre,
          institucion: cert.institucion,
          anio: cert.anio
        })) || []
      };
      // Datos para el Formulario (Lo que va al reset)
      const formData = {
        nombre: data.nombre,
        mail: data.mail || '',
        celular: data.celular,
        especialidad: data.especialidad,
        certificaciones: [], // Ojo: en tu código original lo reseteabas vacío, ¿es intencional?
        registro_empleado: data.registro_empleado,
        imagen: data.imagen || undefined,
        imagen_url: data.imagen_url || '',
      };

      data.imagen = data.imagen || undefined;

      return { raw: data, uiData, formData };
    }
  });
}

export function useUsersPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserData) => {
      try {
        const formData = new FormData();
        formData.append("nombre", data.nombre);
        formData.append("rni", data.rni.toString());
        if (data.especialidad) formData.append("especialidad", data.especialidad);
        formData.append("celular", data.celular.toString());
        formData.append("estado", data.estado);
        formData.append("departamento", data.departamento);
        if (data.registro_empleado !== undefined) formData.append("registro_empleado", data.registro_empleado);
        formData.append("fecha_inscripcion", data.fecha_inscripcion);
        if (data.imagen) {
          const imageId = await presignedUrlPost(data.imagen as File);
          formData.append("imagen", imageId);
        }
        const response = await api.post('users/', { body: formData });
        return response.json();
      } catch (error) {
        if (error instanceof HTTPError) {
          const errorBody = await error.response.json();
          const message = errorBody.rni?.[0] || 'Error en el registro del usuario';
          throw new Error(message);
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Usuario creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ['users', 'admin'] });
    },
    onError: (error: any) => {
      if (error.message === 'Este RNI ya esta registrado.') {
        toast.error("Este RNI ya está registrado.");
        return;
      }
      toast.error("Error al crear el usuario");
    }
  });
}


export function useUsersPatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data, data_old }: { id: number, data: Partial<UserData>, data_old: Partial<UserData> }) => {
      const formData = new FormData();
      let hasChanges = false;

      const appendIfChanged = (key: string, newValue: any, oldValue: any) => {
        if (newValue !== oldValue) {
          formData.append(key, newValue);
          hasChanges = true;
        }
      };

      appendIfChanged("nombre", data.nombre, data_old.nombre);
      appendIfChanged("rni", data.rni?.toString(), data_old.rni?.toString());
      appendIfChanged("especialidad", data.especialidad, data_old.especialidad);
      appendIfChanged("estado", data.estado, data_old.estado);
      appendIfChanged("celular", data.celular?.toString(), data_old.celular?.toString());
      appendIfChanged("departamento", data.departamento, data_old.departamento);
      appendIfChanged("registro_empleado", data.registro_empleado, data_old.registro_empleado);
      appendIfChanged("fecha_inscripcion", data.fecha_inscripcion, data_old.fecha_inscripcion);
      appendIfChanged("mail", data.mail, data_old.mail);

      if (JSON.stringify(data.certificaciones) !== JSON.stringify(data_old.certificaciones)) {
        formData.append("certificaciones", JSON.stringify(data.certificaciones || []));
        hasChanges = true;
      }

      if (data.imagen !== data_old.imagen) {
        if (data_old.imagen_url) {
          const uploadRes = await presignedUrlPatch(
            data.imagen as File,
            data_old.imagen_url as string
          );
          if (!uploadRes) {
            throw new Error("Error al subir la imagen");
          }
        } else {
          const imageId = await presignedUrlPost(data.imagen as File);
          formData.append("imagen", imageId);
        }
        hasChanges = true;
      }

      if (!hasChanges) {
        return { message: "Sin cambios en base de datos" };
      }

      const response = await api.patch(`users/${id}/`, {
        body: formData,
      });

      return response.json();
    },
    onSuccess: (_data: any) => {
      if (_data.message === "Sin cambios en base de datos") {
        toast.info("No se realizaron cambios en el usuario");
        return;
      } else {
        toast.success("Usuario actualizado exitosamente");
        queryClient.invalidateQueries({ queryKey: ['users', 'admin'] });
      }
    },
    onError: () => {
      toast.error("Error al actualizar el usuario");
    }
  });
}

export function useUserPatchUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data, data_old }: { id: number, data: Partial<UserData>, data_old: Partial<UserData> }) => {
      const formData = new FormData();
      let hasChanges = false;

      const appendIfChanged = (key: string, newValue: any, oldValue: any) => {
        if (newValue !== oldValue) {
          formData.append(key, newValue);
          hasChanges = true;
        }
      };

      appendIfChanged("nombre", data.nombre, data_old.nombre);
      appendIfChanged("mail", data.mail, data_old.mail);
      appendIfChanged("celular", data.celular?.toString(), data_old.celular?.toString());
      appendIfChanged("especialidad", data.especialidad, data_old.especialidad);
      appendIfChanged("registro_empleado", data.registro_empleado, data_old.registro_empleado);

      if (JSON.stringify(data.certificaciones) !== JSON.stringify(data_old.certificaciones)) {
        formData.append("certificaciones", JSON.stringify(data.certificaciones || []));
        hasChanges = true;
      }

      if (data.imagen !== data_old.imagen) {
        if (data_old.imagen_url) {
          const uploadRes = await presignedUrlPatch(
            data.imagen as File,
            data_old.imagen_url as string
          );
          if (!uploadRes) {
            throw new Error("Error al subir la imagen");
          }
        } else {
          const imageId = await presignedUrlPost(data.imagen as File);
          formData.append("imagen", imageId);
        }
        hasChanges = true;
      }
      if (!hasChanges) {
        return { message: "Sin cambios en base de datos" };
      }

      const response = await api.patch(`users/${id}/`, {
        body: formData,
      });

      return response.json();
    },
    onSuccess: (data: any) => {
      if (data.message === "Sin cambios en base de datos") {
        toast.info("No se realizaron cambios en el perfil");
        return;
      }
      toast.success("Perfil actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (err) => {
      toast.error("Error al actualizar el perfil");
      console.error('Error en useUserPatchUserProfile:', err);
    }
  });
}

export function useUserDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`users/${id}/`);
      return response.status === 204;
    },
    onSuccess: () => {
      toast.success("Usuario eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ['users', 'admin'] });
    },
    onError: () => {
      toast.error("Error al eliminar el usuario");
    },
    onMutate: () => {
      const toastId = toast.loading("Eliminando usuario...");
      return { toastId };
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
    },
  });
}