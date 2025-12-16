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
    if (data.email) formData.append("email", data.email);
    formData.append("rni", data.rni.toString());
    formData.append("rol", data.rol);
    if (data.especialidad) formData.append("especialidad", data.especialidad);
    formData.append("celular", data.celular.toString());
    formData.append("estado", data.estado);
    formData.append("departamento", data.departamento);
    if (data.empleado !== undefined) formData.append("empleado", data.empleado ? "true" : "false");
    formData.append("fecha_inscripcion", data.fecha_inscripcion.toISOString());
    if (data.imagen) formData.append("imagen", data.imagen);
    const response = await api.post('users/', { body: formData });
    return response.json();
  };
  return { postUser };
}