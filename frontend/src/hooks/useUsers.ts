import { useEffect, useState } from 'react';
import api from '../api/kyClient';
import { type UserData } from '../validations/userSchema';
import { presignedUrlPost, presignedUrlPatch } from "./presignedUrl";

export function useUsersAdmin() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchUsers = async () => {
    try {
      const data: UserData[] = await api.get("users/").json();
      setUsers(data);
    } catch (err) {
      setError("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return { users, loading, error, refetchUsers: fetchUsers };
}

export async function useUsersDetailAdmin(id: number) {
  const data: UserData = await api.get(`users/${id}/`).json();
  if (data.imagen) {
    const imageDataRes = await api.get(`users/${data.id}/img-download`)
      .json<{ download_url: string, img_id: string }>();
    console.log('Respuesta de la descarga de imagen:', imageDataRes);
    data.imagen_url = `${imageDataRes.img_id}`;
    data.imagen = imageDataRes.download_url;
  }

  return data;
}

export function useUsersPost() {
  const postUser = async (data: UserData) => {
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
  };
  return { postUser };
}

export function useUsersPatch() {
  const patchUser = async (id: number, data: Partial<UserData>, data_old: Partial<UserData>) => {
    const formData = new FormData();
    let hasChanges = false;

    const appendIfChanged = (key: string, value: any) => {
      formData.append(key, value);
      hasChanges = true;
    };
    if (data.nombre && data.nombre !== data_old.nombre) appendIfChanged("nombre", data.nombre);
    if (data.rni !== undefined && data.rni !== data_old.rni) appendIfChanged("rni", data.rni.toString());
    if (data.especialidad && data.especialidad !== data_old.especialidad) appendIfChanged("especialidad", data.especialidad);
    if (data.celular !== undefined && data.celular !== data_old.celular) appendIfChanged("celular", data.celular.toString());
    if (data.estado && data.estado !== data_old.estado) appendIfChanged("estado", data.estado);
    if (data.departamento && data.departamento !== data_old.departamento) appendIfChanged("departamento", data.departamento);
    if (data.registro_empleado !== undefined && data.registro_empleado !== data_old.registro_empleado) appendIfChanged("registro_empleado", data.registro_empleado);
    if (data.fecha_inscripcion && data.fecha_inscripcion !== data_old.fecha_inscripcion) appendIfChanged("fecha_inscripcion", data.fecha_inscripcion);
    if (data.mail && data.mail !== data_old.mail) appendIfChanged("mail", data.mail);
    if (data.certificaciones && JSON.stringify(data.certificaciones) !== JSON.stringify(data_old.certificaciones)) {
      appendIfChanged("certificaciones", JSON.stringify(data.certificaciones));
    }
    if (data.imagen && data.imagen !== data_old.imagen) {
      hasChanges = true;

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
    }
    if (!hasChanges) {
      return null;
    }
    console.log('FormData to be sent in patch:', formData);
    const response = await api.patch(`users/${id}/`, { body: formData });
    return response.json();
  };
  return { patchUser };
}

export async function useUserDelete(id: number) {
  const response = await api.delete(`users/${id}/`);
  return response.json();
}