import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Plus, Edit, Trash2, Search, UserCheck, UserX, Upload } from 'lucide-react';
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, type UserData } from '../../validations/userSchema';
import { useUsersPost, useUsers } from '../../hooks/useUsers';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

export function AdminUsersManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newsImagePreview, setNewsImagePreview] = useState<string>('');
  const { postUser } = useUsersPost();
  const { users, refetchUsers } = useUsers();
  console.log(users);
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<UserData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nombre: "",
      rni: "",
      especialidad: "estructural",
      celular: "",
      departamento: "La Paz",
      registro_empleado: "",
      estado: "pendiente",
      fecha_inscripcion: "",
      imagen: undefined,
    },
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rni.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.celular.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
    reset({
      rni: "",
      especialidad: "estructural",
      celular: "",
      departamento: "La Paz",
      registro_empleado: "",
      estado: "pendiente",
      fecha_inscripcion: "",
      imagen: undefined,
    });
  };

  const handleEdit = (user: any) => {
    reset({
      ...user,
      imagen: undefined,
    });
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      console.log('Eliminando usuario:', id);
    }
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Activo' ? 'Suspendido' : 'Activo';
    console.log('Cambiando estado del usuario', id, 'a', newStatus);
  };

  const handleSave: SubmitHandler<UserData> = async (data) => {
    setIsDialogOpen(false);
    console.log('Guardando oferta:', data);
    const res = await postUser(data);
    console.log('Respuesta del servidor:', res);
    setNewsImagePreview("");
    reset();
    refetchUsers();
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'activo': 'bg-secondary text-secondary-foreground',
      'inactivo': 'bg-destructive text-destructive-foreground',
    };
    return colors[status] || 'bg-muted text-foreground';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>Administra los perfiles de los miembros del colegio</CardDescription>
            </div>
            <Button onClick={handleCreate} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por nombre, registro o celular..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 text-muted-foreground">
            Mostrando {filteredUsers.length} de {users.length} usuarios
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Registro CICB</TableHead>
                  <TableHead>Registro Ingeniero</TableHead>
                  <TableHead>Fecha Inscripción</TableHead>
                  <TableHead>Celular</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Estado Laboral</TableHead>
                  <TableHead>Estado Cuenta</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nombre}</TableCell>
                    <TableCell>{user.rni}</TableCell>
                    <TableCell>{user.rnic}</TableCell>
                    <TableCell>{new Date(user.fecha_inscripcion).toLocaleDateString('es-BO')}</TableCell>
                    <TableCell>{user.celular}</TableCell>
                    <TableCell>
                      <Badge variant="outline"><p className='capitalize'>{user.especialidad}</p></Badge>
                    </TableCell>
                    <TableCell>{user.departamento}</TableCell>
                    <TableCell>
                      <Badge variant={user.registro_empleado === 'desempleado' ? 'default' : 'secondary'}>
                        <p className='capitalize'>{user.registro_empleado}</p>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.estado)}>
                        <p className='capitalize'>{user.estado}</p>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => user.id !== undefined && handleToggleStatus(user.id, user.estado)}
                          title={user.estado === 'activo' ? 'Suspender' : 'Activar'}
                        >
                          {user.estado === 'activo' ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => user.id !== undefined && handleDelete(user.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron usuarios que coincidan con tu búsqueda.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit(handleSave)}>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </DialogTitle>
              <DialogDescription>
                Completa los campos para {editingUser ? 'actualizar' : 'crear'} el perfil del usuario
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input id="name" placeholder="Nombre completo" {...register("nombre")} />
                  {errors.nombre && (<Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                    <AlertTitle className='text-sm'>Error en Nombre</AlertTitle>
                    <AlertDescription className='text-xs'>{errors.nombre.message}</AlertDescription>
                  </Alert>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration">RNI</Label>
                  <Input id="registration" placeholder="CICB-XX-XXXX" {...register("rni")} />
                  {errors.rni && (<Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                    <AlertTitle className='text-sm'>Error en RNI</AlertTitle>
                    <AlertDescription className='text-xs'>{errors.rni.message}</AlertDescription>
                  </Alert>)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidad</Label>
                  <Controller
                    name="especialidad"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona especialidad" />
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
                          </SelectContent>
                        </Select>
                        {errors.especialidad && (
                          <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                            <AlertTitle className='text-sm'>Error en Especialidad</AlertTitle>
                            <AlertDescription className='text-xs'>{errors.especialidad.message}</AlertDescription>
                          </Alert>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha_inscripcion">Fecha de Inscripción</Label>
                  <Input id="fecha_inscripcion" type="date" {...register("fecha_inscripcion")} />
                  {errors.fecha_inscripcion && (<Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                    <AlertTitle className='text-sm'>Error en Fecha de Inscripción</AlertTitle>
                    <AlertDescription className='text-xs'>{errors.fecha_inscripcion.message}</AlertDescription>
                  </Alert>)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Celular</Label>
                  <Input id="phone" placeholder="+591 XXXXXXXX" {...register("celular")} />
                  {errors.celular && (<Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                    <AlertTitle className='text-sm'>Error en Celular</AlertTitle>
                    <AlertDescription className='text-xs'>{errors.celular.message}</AlertDescription>
                  </Alert>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado de Cuenta</Label>
                  <Controller
                    name="estado"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona estado de cuenta" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="activo">Activo</SelectItem>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="suspendido">Suspendido</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.estado && (<Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                          <AlertTitle className='text-sm'>Error en Estado de Cuenta</AlertTitle>
                          <AlertDescription className='text-xs'>{errors.estado.message}</AlertDescription>
                        </Alert>)}
                      </>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Estado Laboral</Label>
                  <Controller
                    name="registro_empleado"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona estado laboral" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="empleado">Empleado</SelectItem>
                            <SelectItem value="desempleado">Desempleado</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.registro_empleado && (<Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                          <AlertTitle className='text-sm'>Error en Estado Laboral</AlertTitle>
                          <AlertDescription className='text-xs'>{errors.registro_empleado.message}</AlertDescription>
                        </Alert>)}
                      </>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Controller
                    name="departamento"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona departamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="La Paz">La Paz</SelectItem>
                            <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                            <SelectItem value="Cochabamba">Cochabamba</SelectItem>
                            <SelectItem value="Tarija">Tarija</SelectItem>
                            <SelectItem value="Oruro">Oruro</SelectItem>
                            <SelectItem value="Potosí">Potosí</SelectItem>
                            <SelectItem value="Chuquisaca">Chuquisaca</SelectItem>
                            <SelectItem value="Beni">Beni</SelectItem>
                            <SelectItem value="Pando">Pando</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.departamento && (<Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                          <AlertTitle className='text-sm'>Error en Departamento</AlertTitle>
                          <AlertDescription className='text-xs'>{errors.departamento.message}</AlertDescription>
                        </Alert>)}
                      </>
                    )}
                  />
                </div>
              </div>

              <Controller
                name="imagen"
                control={control}
                render={({ field }) => {
                  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (file.size > 5 * 1024 * 1024) {
                      alert("La imagen no debe superar los 5MB");
                      return;
                    }

                    // Actualizamos React Hook Form
                    field.onChange(file);

                    // Actualizamos el preview
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setNewsImagePreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  };

                  const removeImage = () => {
                    field.onChange(undefined);
                    setNewsImagePreview("");
                  };

                  return (
                    <div className="space-y-2">
                      <Label htmlFor="image">Imagen de Perfil (Opcional)</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('image')?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Subir Imagen
                        </Button>
                        {newsImagePreview && (
                          <div className="relative">
                            <img
                              src={newsImagePreview}
                              alt="Preview"
                              className="w-16 h-16 rounded-full object-cover border-2 border-border"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive hover:bg-destructive/90"
                              onClick={removeImage}
                            >
                              <Trash2 className="w-3 h-3 text-destructive-foreground" />
                            </Button>
                          </div>
                        )}
                        {!newsImagePreview && editingUser?.image && (
                          <div className="text-muted-foreground">Imagen actual existente</div>
                        )}
                      </div>
                      <p className="text-muted-foreground">Sube una foto de perfil opcional (formato JPG, PNG)</p>
                      {errors.imagen && (<Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                        <AlertTitle className='text-sm'>Error en Imagen</AlertTitle>
                        <AlertDescription className='text-xs'>{errors.imagen.message}</AlertDescription>
                      </Alert>)}
                    </div>
                  );
                }}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type='submit' className="bg-primary text-primary-foreground">
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}