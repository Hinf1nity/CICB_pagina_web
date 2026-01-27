import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Phone, Award, FileText, Building2, Mail } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useUsersDetailCard } from '../hooks/useUsers';
import type { UserData } from '../validations/userSchema';

export function UserCardPage() {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<UserData>({
    id: undefined,
    nombre: '',
    rni: '',
    especialidad: '',
    celular: '',
    departamento: '',
    estado: '',
    fecha_inscripcion: '',
    imagen: '',
    imagen_url: '',
    certificaciones: [],
  })

  useEffect(() => {
    async function fetchData() {
      const data = await useUsersDetailCard(Number(id));
      console.log('Datos del usuario:', data);
      setUserData(data);
      // Aquí podrías actualizar el estado con los datos reales
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 border-primary/20 overflow-hidden">
        {/* Header con color institucional */}
        <div className="bg-primary text-primary-foreground py-6 px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="w-6 h-6" />
            <h3 className="text-primary-foreground">CICB</h3>
          </div>
          <p className="text-primary-foreground/90">Tarjeta de Identificación Profesional</p>
        </div>

        <CardContent className="p-8 bg-card">
          {/* Foto de perfil */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="w-40 h-40 border-4 border-primary shadow-lg">
                <AvatarImage src={userData.imagen_url} />
                <AvatarFallback className="bg-primary text-primary-foreground text-5xl">
                  {userData.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full shadow-md">
                <span className='capitalize'>{userData.estado}</span>
              </div>
            </div>
          </div>

          {/* Información del usuario */}
          <div className="text-center space-y-5 mt-8">
            {/* Nombre */}
            <div className="border-b border-border pb-4">
              <h2 className="text-foreground">{userData.nombre}</h2>
            </div>

            {/* Especialidad */}
            <div className="flex items-center justify-center gap-3 py-3 bg-muted rounded-lg">
              <Award className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-foreground capitalize">Ing. {userData.especialidad}</span>
            </div>

            {/* RNI */}
            <div className="flex items-center justify-center gap-3 py-3 bg-muted rounded-lg">
              <FileText className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-foreground">RNI: {userData.rni}</span>
            </div>

            {/* RNIC */}
            <div className="flex items-center justify-center gap-3 py-3 bg-muted rounded-lg">
              <FileText className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-foreground">RNIC: {userData.rnic}</span>
            </div>

            {/* Teléfono */}
            <div className="flex items-center justify-center gap-3 py-3 bg-muted rounded-lg">
              <Phone className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-foreground">{userData.celular}</span>
            </div>

            {/* Mail */}
            {userData.mail && (
              <div className="flex items-center justify-center gap-3 py-3 bg-muted rounded-lg">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">{userData.mail}</span>
              </div>
            )}
          </div>

          {/* Certificaciones */}
          {(userData.certificaciones ?? []).length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="text-foreground">Certificaciones</h3>
              </div>
              <div className="space-y-2">
                {(userData.certificaciones ?? []).map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-muted/50 rounded-lg p-3 text-left"
                  >
                    <p className="text-foreground mb-1">{cert.nombre}</p>
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>{cert.institucion}</span>
                      <span>{cert.anio}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground">
              Colegio de Ingenieros Civiles de Bolivia
            </p>
            <p className="text-muted-foreground mt-1">
              www.cicb.org.bo
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}