import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Award, Edit, QrCode, CreditCard, LogOut, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../auth/useAuth';

interface UserProfilePageProps {
  onNavigate?: (page: string, id?: number) => void;
}

export function UserProfilePage({ onNavigate }: UserProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { logout } = useAuth();
  const [userData, setUserData] = useState({
    name: 'Juan Carlos Pérez Gutiérrez',
    email: 'juan.perez@email.com',
    phone: '+591 70123456',
    registration: 'CICB-LP-1234',
    specialty: 'Ingeniería Estructural',
    city: 'La Paz',
    registrationDate: '2015-03-15',
    status: 'Activo'
  });

  const certifications = [
    { id: 1, name: 'Diseño Sismorresistente Avanzado', institution: 'CICB', year: 2024 },
    { id: 2, name: 'BIM para Ingeniería Civil', institution: 'Autodesk', year: 2023 },
    { id: 3, name: 'Gestión de Proyectos PMI', institution: 'PMI Bolivia', year: 2022 },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Aquí iría la lógica para guardar los datos
  };

  const handleDownloadQR = () => {
    // Obtener el elemento SVG del código QR
    const svg = document.querySelector('#qr-code-svg') as SVGElement;
    if (!svg) return;

    // Crear un canvas para convertir el SVG a imagen
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar el tamaño del canvas
    const svgSize = 180;
    const padding = 40; // Padding adicional
    canvas.width = svgSize + padding * 2;
    canvas.height = svgSize + padding * 2;

    // Fondo blanco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Convertir SVG a data URL
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    // Crear imagen y dibujar en canvas
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, padding, padding, svgSize, svgSize);
      
      // Convertir canvas a blob y descargar
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.download = `QR_${userData.registration}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        }
      });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="mb-3">Mi Perfil Profesional</h1>
              <p>Gestiona tu información profesional y credenciales del CICB</p>
            </div>
            <Button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Card and QR */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="w-32 h-32 border-4 border-primary">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                        {userData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-foreground mb-1">{userData.name}</h3>
                  <p className="text-muted-foreground mb-3">{userData.specialty}</p>
                  <Badge className="bg-secondary text-secondary-foreground">
                    {userData.status}
                  </Badge>
                </div>

                <div className="mt-6 space-y-3 pt-6 border-t border-border">
                  <div className="flex items-center text-muted-foreground">
                    <Award className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-foreground">Registro</p>
                      <p>{userData.registration}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-foreground">Ciudad</p>
                      <p>{userData.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-foreground">Colegiado desde</p>
                      <p>{new Date(userData.registrationDate).getFullYear()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Código QR
                </CardTitle>
                <CardDescription>
                  Código de identificación profesional
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={`https://localhost:5173/tarjeta_usuario/${userData.registration}`}
                    size={180}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className='w-full space-y-2'>
                  {onNavigate && (
                    <Button 
                      onClick={() => onNavigate('user-card', 1)}
                      className="w-full bg-primary text-primary-foreground"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Ver Tarjeta
                    </Button>
                  )}
                  <Button
                    onClick={handleDownloadQR}
                    variant='outline'
                    className='w-full'
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar QR
                </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Certificaciones</span>
                  <span className="text-primary">{certifications.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Años de Experiencia</span>
                  <span className="text-primary">10+</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Estado</span>
                  <Badge className="bg-secondary text-secondary-foreground">{userData.status}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">
                  <User className="w-4 h-4 mr-2" />
                  Información Personal
                </TabsTrigger>
                <TabsTrigger value="certifications">
                  <Award className="w-4 h-4 mr-2" />
                  Certificaciones
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Datos Personales</CardTitle>
                        <CardDescription>Información de contacto y datos profesionales</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Información Básica */}
                      <div>
                        <h4 className="text-foreground mb-4 pb-2 border-b border-border">
                          Información Básica
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input
                              id="name"
                              value={`Ing. ${userData.name}`}
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
                              className="bg-muted"
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
                      </div>

                      {/* Información de Contacto */}
                      <div>
                        <h4 className="text-foreground mb-4 pb-2 border-b border-border">
                          Información de Contacto
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                              <Input
                                id="email"
                                type="email"
                                value={userData.email}
                                disabled={!isEditing}
                                onChange={(e) => setUserData({...userData, email: e.target.value})}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                              <Input
                                id="phone"
                                value={userData.phone}
                                disabled={!isEditing}
                                onChange={(e) => setUserData({...userData, phone: e.target.value})}
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Información Adicional */}
                      <div>
                        <h4 className="text-foreground mb-4 pb-2 border-b border-border">
                          Información Adicional
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="regDate">Fecha de Registro</Label>
                            <Input
                              id="regDate"
                              value={new Date(userData.registrationDate).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}
                              disabled
                              className="bg-muted"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status">Estado</Label>
                            <Input
                              id="status"
                              value={userData.status}
                              disabled
                              className="bg-muted"
                            />
                          </div>
                        </div>
                      </div>
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
                        <CardDescription>Tus capacitaciones y certificaciones profesionales registradas</CardDescription>
                      </div>
                      <Button className="bg-primary text-primary-foreground">
                        <Award className="w-4 h-4 mr-2" />
                        Agregar Certificación
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {certifications.map((cert, index) => (
                        <div 
                          key={cert.id} 
                          className="border border-border rounded-lg p-5 hover:shadow-md transition-shadow bg-card"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Award className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="text-foreground mb-1">{cert.name}</h4>
                                <p className="text-muted-foreground mb-2">{cert.institution}</p>
                                <div className="flex items-center gap-4 text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Año: {cert.year}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              Certificado #{index + 1}
                            </Badge>
                          </div>
                        </div>
                      ))}

                      {certifications.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No tienes certificaciones registradas</p>
                          <p>Agrega tus certificaciones para mantener tu perfil actualizado</p>
                        </div>
                      )}
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
