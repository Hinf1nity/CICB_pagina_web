import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Award, IdCardLanyard, Edit, QrCode, CreditCard, LogOut, Download, Trash2, Camera } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { useAuth } from '../auth/useAuth';
import { useUsersDetailAdmin, useUsersPatch } from '../hooks/useUsers';
import { type UserPageData, userPageSchema } from '../validations/userPageSchema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { zodResolver } from '@hookform/resolvers/zod';

interface UserProfilePageProps {
  onNavigate?: (page: string, id?: number) => void;
}

interface Certification {
  nombre: string;
  institucion: string;
  anio: string;
}

export function UserProfilePage({ onNavigate }: UserProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const { logout, user } = useAuth();
  const { patchUser } = useUsersPatch();
  const [userDataCopy, setUserDataCopy] = useState<Partial<UserPageData>>({});
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    registration: '',
    specialty: '',
    city: '',
    registrationDate: '',
    status: '',
    statusLaboral: '',
    experienceYears: 0,
  });
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<UserPageData>({
    resolver: zodResolver(userPageSchema),
    defaultValues: {
      nombre: '',
      mail: '',
      celular: '',
      especialidad: '',
      certificaciones: [],
      registro_empleado: 'desempleado',
    }
  });
  console.log('Form errors:', errors);

  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        const data = await useUsersDetailAdmin(user.id);
        console.log('User data fetched:', data);
        setUserDataCopy(data);
        const yearsDifference = new Date().getFullYear() - new Date(data.fecha_inscripcion).getFullYear();
        const hasPassedAniversary = (new Date().getMonth() > new Date(data.fecha_inscripcion).getMonth()) ||
          (new Date().getMonth() === new Date(data.fecha_inscripcion).getMonth() && new Date().getDate() >= new Date(data.fecha_inscripcion).getDate());
        const years = hasPassedAniversary ? yearsDifference : yearsDifference - 1;

        setUserData({
          id: data.id?.toString() || '',
          name: data.nombre,
          registration: data.rni,
          specialty: `Ing. ${data.especialidad.charAt(0).toUpperCase() + data.especialidad.slice(1).toLowerCase()}` || 'No especificada',
          city: data.departamento || 'No especificada',
          registrationDate: data.fecha_inscripcion,
          status: data.estado?.charAt(0).toUpperCase() + data.estado?.slice(1).toLowerCase(),
          statusLaboral: data.registro_empleado ? data.registro_empleado.charAt(0).toUpperCase() +
            data.registro_empleado.slice(1).toLowerCase() : 'No especificado',
          experienceYears: years,
        });
        if (data.imagen) {
          setPhotoUrl(data.imagen as string);
        }
        else {
          setPhotoUrl('');
        }
        setCertifications(data.certificaciones?.map(cert => ({
          nombre: cert.nombre,
          institucion: cert.institucion,
          anio: cert.anio
        })) || []);
        reset({
          nombre: data.nombre,
          mail: data.mail || '',
          celular: data.celular,
          especialidad: data.especialidad,
          certificaciones: data.certificaciones || [],
          registro_empleado: data.registro_empleado,
        });
      }
    }
    fetchUserData();
  }, [user]);

  const handleSave: SubmitHandler<UserPageData> = async (data) => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    setIsEditing(false);
    console.log('Saved data:', data);
    const res = await patchUser(parseInt(userData.id), data, userDataCopy as Partial<UserPageData>) as UserPageData;
    console.log('Patch response:', res);
    reset({
      nombre: res.nombre,
      mail: res.mail || '',
      celular: res.celular,
      especialidad: res.especialidad,
      registro_empleado: res.registro_empleado,
    });
    setUserDataCopy(res);
    setUserData({
      ...userData,
      name: res.nombre,
      specialty: `Ing. ${res.especialidad.charAt(0).toUpperCase() + res.especialidad.slice(1).toLowerCase()}` || 'No especificada',
      statusLaboral: res.registro_empleado ? res.registro_empleado.charAt(0).toUpperCase() +
        res.registro_empleado.slice(1).toLowerCase() : 'No especificado',
    });
  };

  const handleAddCertification = async (data) => {
    const data_new = [...certifications, {
      nombre: data.certificaciones[0].nombre,
      institucion: data.certificaciones[0].institucion,
      anio: data.certificaciones[0].anio.toString()
    }].sort((a, b) => parseInt(b.anio) - parseInt(a.anio));
    console.log('New certifications list:', data_new);
    setIsCertDialogOpen(false);
    const res = await patchUser(parseInt(userData.id), { certificaciones: data_new }, userData as Partial<UserPageData>);
    console.log('Patch response for certifications:', res);
    setCertifications(data_new);
    reset();
  };

  const handleDeleteCertification = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta certificación?')) {
      console.log('Delete certification with id:', id);
      const data_new = certifications.filter((_, index) => index !== id);
      setCertifications(data_new);
      patchUser(parseInt(userData.id), { certificaciones: data_new }, userData as Partial<UserPageData>);
    }
  };

  const handleUpdatePhoto = async (data) => {
    setPhotoUrl(tempPhotoUrl);
    setIsPhotoDialogOpen(false);
    setTempPhotoUrl('');
    // const res = await patchUser(parseInt(userData.id), { imagen: data.imagen }, userData as Partial<UserPageData>);
    // console.log('Patch response for photo update:', res);
    reset();
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
                    <div className='relative'>
                      <Avatar className="w-32 h-32 border-4 border-primary">
                        <AvatarImage src={photoUrl} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                          {userData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                        onClick={() => setIsPhotoDialogOpen(true)}
                      >
                        <Camera className="w-5 h-5" />
                      </Button>
                    </div>
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
                      <p className="text-foreground">RNI</p>
                      <p>{userData.registration}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <IdCardLanyard className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-foreground">RNIC</p>
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
                    value={`https://localhost/tarjeta_usuario/${userData.id}`}
                    size={180}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="w-full space-y-2">
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
                    variant="outline"
                    className="w-full"
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
                  <span>{userData.experienceYears}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Estado Laboral</span>
                  <Badge className="bg-secondary text-secondary-foreground">{userData.statusLaboral}</Badge>
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
                  <form onSubmit={handleSubmit(handleSave)}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Datos Personales</CardTitle>
                          <CardDescription>Información de contacto y datos profesionales</CardDescription>
                        </div>
                        <Button
                          type='submit'
                          variant="outline"
                        // onClick={() => isEditing ? handleSave() : setIsEditing(true)}
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
                              <Label htmlFor="nombre">Nombre Completo</Label>
                              <Input
                                id="nombre"
                                disabled={!isEditing}
                                {...register("nombre")}
                              />
                              {errors.nombre && (<Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                <AlertTitle className='text-sm'>Error en Nombre</AlertTitle>
                                <AlertDescription className='text-xs'>{errors.nombre.message}</AlertDescription>
                              </Alert>)}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="registration">RNIC</Label>
                              <Input
                                id="registration"
                                value={userData.registration}
                                disabled
                                className="bg-muted"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="especialidad">Especialidad</Label>
                              {isEditing ? (
                                <Controller
                                  name="especialidad"
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                      value={field.value}
                                      onValueChange={field.onChange}
                                    >
                                      <SelectTrigger id="especialidad">
                                        <SelectValue placeholder="Selecciona una especialidad" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="estructural">Estructural</SelectItem>
                                        <SelectItem value="hidráulica">Hidráulica</SelectItem>
                                        <SelectItem value="vial">Vial</SelectItem>
                                        <SelectItem value="geotecnia">Geotecnia</SelectItem>
                                        <SelectItem value="ambiental">Ambiental</SelectItem>
                                        <SelectItem value="construcción">Construcción</SelectItem>
                                        <SelectItem value="sanitaria">Sanitaria</SelectItem>
                                        <SelectItem value="transporte">Transporte</SelectItem>
                                        <SelectItem value="civil">Civil</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                              ) : (
                                <Input
                                  id="especialidad"
                                  value={userData.specialty}
                                  disabled
                                />
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="city">Ciudad</Label>
                              <Input
                                id="city"
                                value={userData.city}
                                disabled
                                onChange={(e) => setUserData({ ...userData, city: e.target.value })}
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
                                  placeholder='Sin correo registrado'
                                  disabled={!isEditing}
                                  className="flex-1"
                                  {...register("mail")}
                                />
                              </div>
                              {errors.mail && (<Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3 mt-1">
                                <AlertTitle className='text-sm'>Error en Correo Electrónico</AlertTitle>
                                <AlertDescription className='text-xs'>{errors.mail.message}</AlertDescription>
                              </Alert>)}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Teléfono</Label>
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                                <Input
                                  id="phone"
                                  disabled={!isEditing}
                                  className="flex-1"
                                  {...register("celular")}
                                />
                              </div>
                              {errors.celular && (<Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3 mt-1">
                                <AlertTitle className='text-sm'>Error en Teléfono</AlertTitle>
                                <AlertDescription className='text-xs'>{errors.celular.message}</AlertDescription>
                              </Alert>)}
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
                              <Label htmlFor="status">Estado Laboral</Label>
                              {isEditing ? (
                                <Controller
                                  name="registro_empleado"
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                      value={field.value}
                                      onValueChange={field.onChange}
                                    >
                                      <SelectTrigger id="status">
                                        <SelectValue placeholder="Selecciona un estado" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="empleado">Empleado</SelectItem>
                                        <SelectItem value="desempleado">Desempleado</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                              ) : (
                                <Input
                                  id="status"
                                  value={userData.statusLaboral}
                                  disabled
                                  className="bg-muted"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </form>
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
                      <Button className="bg-primary text-primary-foreground" onClick={() => setIsCertDialogOpen(true)}>
                        <Award className="w-4 h-4 mr-2" />
                        Agregar Certificación
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="border border-border rounded-lg p-5 hover:shadow-md transition-shadow bg-card"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Award className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="text-foreground mb-1">{cert.nombre}</h4>
                                <p className="text-muted-foreground mb-2">{cert.institucion}</p>
                                <div className="flex items-center gap-4 text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Año: {cert.anio}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              Certificado #{index + 1}
                            </Badge>
                            <Button
                              variant="outline"
                              className="ml-2"
                              onClick={() => handleDeleteCertification(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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

      {/* Certification Dialog */}
      <Dialog open={isCertDialogOpen} onOpenChange={setIsCertDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(handleAddCertification)}>
            <DialogHeader>
              <DialogTitle>Agregar Certificación</DialogTitle>
              <DialogDescription>
                Ingresa los detalles de la certificación que deseas agregar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certName">Nombre de la Certificación</Label>
                <Input
                  id="certName"
                  {...register("certificaciones.0.nombre")}
                />
                {errors.certificaciones && errors.certificaciones[0]?.nombre && (<Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3 mt-1">
                  <AlertTitle className='text-sm'>Error en Nombre de Certificación</AlertTitle>
                  <AlertDescription className='text-xs'>{errors.certificaciones[0]?.nombre?.message}</AlertDescription>
                </Alert>)}
              </div>
              <div className="space-y-2">
                <Label htmlFor="certInstitution">Institución</Label>
                <Input
                  id="certInstitution"
                  {...register("certificaciones.0.institucion")}
                />
                {errors.certificaciones && errors.certificaciones[0]?.institucion && (<Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3 mt-1">
                  <AlertTitle className='text-sm'>Error en Institución</AlertTitle>
                  <AlertDescription className='text-xs'>{errors.certificaciones[0]?.institucion?.message}</AlertDescription>
                </Alert>)}
              </div>
              <div className="space-y-2">
                <Label htmlFor="certYear">Año</Label>
                <Input
                  id="certYear"
                  type="number"
                  {...register("certificaciones.0.anio")}
                />
                {errors.certificaciones && errors.certificaciones[0]?.anio && (<Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3 mt-1">
                  <AlertTitle className='text-sm'>Error en Año</AlertTitle>
                  <AlertDescription className='text-xs'>{errors.certificaciones[0]?.anio?.message}</AlertDescription>
                </Alert>)}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsCertDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                className="ml-2"
              >
                Agregar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Photo Dialog */}
      <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(handleUpdatePhoto)}>
            <DialogHeader>
              <DialogTitle>Cambiar Foto de Perfil</DialogTitle>
              <DialogDescription>
                Sube una nueva foto para tu perfil.
              </DialogDescription>
            </DialogHeader>
            <Controller
              name="imagen"
              control={control}
              render={({ field }) => {
                const file = field.value;

                const isFile = file instanceof File;
                const isUrl = typeof file === 'string' && file.startsWith('http');
                const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                  const newFile = e.target.files?.[0];
                  if (!newFile) return;

                  if (newFile.size > 5 * 1024 * 1024) {
                    alert("La imagen no debe superar los 5MB");
                    return;
                  }

                  // Actualizamos React Hook Form
                  field.onChange(newFile);

                  // Actualizamos el preview
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setTempPhotoUrl(reader.result as string);
                  };
                  reader.readAsDataURL(newFile);
                };

                const removeImage = () => {
                  field.onChange(null);
                  setTempPhotoUrl("");
                };
                return (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="photoUpload">Subir Foto</Label>
                      <Input
                        id="photoUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photoPreview">Vista Previa</Label>
                      <div className="flex justify-center">
                        <Avatar className="w-32 h-32 border-4 border-primary">
                          <AvatarImage src={tempPhotoUrl} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                            {userData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsPhotoDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                className="ml-2"
              >
                Guardar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}