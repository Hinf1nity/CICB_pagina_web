import { useEffect, useState } from 'react';
import api from '../api/kyClient';
import { type UserData } from '../validations/userSchema';

export function useUsers() {
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
    if (data.imagen) formData.append("imagen", data.imagen);
    const response = await api.post('users/', { body: formData });
    return response.json();
  };
  return { postUser };
}