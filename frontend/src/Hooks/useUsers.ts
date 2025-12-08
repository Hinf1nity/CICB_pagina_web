import api from '../api/kyClient';
import { type UserPostData } from '../validations/userSchema';

export function useUsersPost() {
  const postUser = async (data: UserPostData) => {
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
    const response = await api.post('/users', { body: formData });
    return response.json();
  };
  return { postUser };
}