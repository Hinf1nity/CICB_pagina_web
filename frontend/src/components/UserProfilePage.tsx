import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Award, FileText, Edit } from 'lucide-react';

export function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Ing. Juan Carlos Pérez Gutiérrez',
    email: 'juan.perez@email.com',
    phone: '+591 70123456',
    registration: 'CICB-LP-1234',
    specialty: 'Ingeniería Estructural',
    city: 'La Paz',
    registrationDate: '2015-03-15',
    status: 'Activo'
  });

  const projects = [
    { id: 1, name: 'Torre Empresarial Arce', status: 'Completado', year: 2024 },
    { id: 2, name: 'Puente Vehicular El Alto', status: 'En Curso', year: 2025 },
    { id: 3, name: 'Centro Comercial Plaza Sur', status: 'Completado', year: 2023 },
  ];

  const certifications = [
    { id: 1, name: 'Diseño Sismorresistente Avanzado', institution: 'CICB', year: 2024 },
    { id: 2, name: 'BIM para Ingeniería Civil', institution: 'Autodesk', year: 2023 },
    { id: 3, name: 'Gestión de Proyectos PMI', institution: 'PMI Bolivia', year: 2022 },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Aquí iría la lógica para guardar los datos
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="mb-3">Mi Perfil</h1>
          <p>Gestiona tu información profesional y credenciales</p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                      {userData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{userData.name}</CardTitle>
                <CardDescription>{userData.specialty}</CardDescription>
                <div className="flex justify-center mt-3">
                  <Badge className="bg-secondary text-secondary-foreground">
                    {userData.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-muted-foreground">
                  <Award className="w-4 h-4 mr-2 text-primary" />
                  <span>Registro: {userData.registration}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  <span>{userData.city}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  <span>Colegiado desde {new Date(userData.registrationDate).getFullYear()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Proyectos Registrados</span>
                  <span className="text-primary">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Certificaciones</span>
                  <span className="text-primary">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Años de Experiencia</span>
                  <span className="text-primary">10+</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="projects">Proyectos</TabsTrigger>
                <TabsTrigger value="certifications">Certificaciones</TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Información Personal</CardTitle>
                        <CardDescription>Actualiza tus datos personales y de contacto</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {isEditing ? 'Guardar' : 'Editar'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input
                          id="name"
                          value={userData.name}
                          disabled={!isEditing}
                          onChange={(e) => setUserData({...userData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registration">Número de Registro</Label>
                        <Input
                          id="registration"
                          value={userData.registration}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userData.email}
                          disabled={!isEditing}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={userData.phone}
                          disabled={!isEditing}
                          onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialty">Especialidad</Label>
                        <Input
                          id="specialty"
                          value={userData.specialty}
                          disabled={!isEditing}
                          onChange={(e) => setUserData({...userData, specialty: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                          id="city"
                          value={userData.city}
                          disabled={!isEditing}
                          onChange={(e) => setUserData({...userData, city: e.target.value})}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Proyectos Registrados</CardTitle>
                        <CardDescription>Lista de proyectos en los que has participado</CardDescription>
                      </div>
                      <Button className="bg-primary text-primary-foreground">
                        <FileText className="w-4 h-4 mr-2" />
                        Registrar Proyecto
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="border border-border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-foreground mb-1">{project.name}</h4>
                              <p className="text-muted-foreground">Año: {project.year}</p>
                            </div>
                            <Badge className={project.status === 'Completado' ? 'bg-secondary text-secondary-foreground' : 'bg-accent text-accent-foreground'}>
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Certifications Tab */}
              <TabsContent value="certifications">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Certificaciones y Cursos</CardTitle>
                        <CardDescription>Tus capacitaciones y certificaciones profesionales</CardDescription>
                      </div>
                      <Button className="bg-primary text-primary-foreground">
                        <Award className="w-4 h-4 mr-2" />
                        Agregar Certificación
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {certifications.map((cert) => (
                        <div key={cert.id} className="border border-border rounded-lg p-4">
                          <h4 className="text-foreground mb-1">{cert.name}</h4>
                          <p className="text-muted-foreground mb-1">{cert.institution}</p>
                          <p className="text-muted-foreground">Año: {cert.year}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
