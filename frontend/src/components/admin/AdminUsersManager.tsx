import { useEffect, useState } from 'react';
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
import { useUsersPost, useUsersAdmin, useUsersDetailAdmin, useUsersPatch, useUserDelete } from '../../hooks/useUsers';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { useDebounce } from 'use-debounce';

export function AdminUsersManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [filterStatus, setFilterStatus] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newsImagePreview, setNewsImagePreview] = useState<string>('');
  useEffect(() => {
    setPage(1); // Reset to first page on new search
  }, [debouncedSearchTerm, filterStatus]);
  const { users, next, previous, count, isSearching } = useUsersAdmin(page, debouncedSearchTerm, filterStatus);
  const { mutate: postUser, isPending: isPosting } = useUsersPost();
  const pageSize = 20; // Paginacion se agrega esto y el count de arriba
  const totalPages = count ? Math.ceil(count / pageSize) : 1;
  const { mutate: patchUser, isPending: isPatching } = useUsersPatch();
  const { mutate: deleteUser } = useUserDelete();
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<UserData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nombre: "",
      rni: "",
      especialidad: "estructural",
      celular: "",
      departamento: "La Paz",
      registro_empleado: "",
      estado: "",
      fecha_inscripcion: "",
      imagen: undefined,
    },
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
      estado: "",
      fecha_inscripcion: "",
      imagen: undefined,
    });
  };

  const handleEdit = async (user: any) => {
    const detailedUser = await useUsersDetailAdmin(user.id);
    reset({
      ...detailedUser,
      rnic: detailedUser.rnic?.toString(),
    });
    setEditingUser(detailedUser);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      deleteUser(id);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'activo' ? 'inactivo' : 'activo';
    const data = { estado: newStatus };
    const data_old = { estado: currentStatus };
    patchUser({ id, data, data_old });
  };

  const handleSave: SubmitHandler<UserData> = (data) => {
    if (editingUser) {
      patchUser({ id: editingUser.id, data, data_old: editingUser }, {
        onSuccess: () => {
          setEditingUser(null);
          setIsDialogOpen(false);
          setNewsImagePreview("");
          reset();
        }
      });
    } else {
      postUser(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setNewsImagePreview("");
          reset();
        }
      });
    }
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
              <CardTitle>Gestión de Colegiados</CardTitle>
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
                placeholder="Buscar por nombre, RNI o celular..."
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
            Mostrando {1 + (page - 1) * pageSize}-{Math.min(page * pageSize, count)} de {count} usuarios
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>RNIC</TableHead>
                  <TableHead>RNI</TableHead>
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
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nombre}</TableCell>
                    <TableCell>{user.rnic}</TableCell>
                    <TableCell>{user.rni}</TableCell>
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
            {/* creamos la paginacion y sus flechas */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={!previous}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                Anterior
              </Button>

              <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={!next}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>

          {users.length === 0 && (
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
                  <Input id="registration" placeholder="XXXXXX" {...register("rni")} />
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
                            <SelectItem value="civil">Civil</SelectItem>
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
                  <Input id="phone" placeholder="+591XXXXXXXX" {...register("celular")} />
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
                            <SelectItem value="inactivo">Inactivo</SelectItem>
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
                      setNewsImagePreview(reader.result as string);
                    };
                    reader.readAsDataURL(newFile);
                  };

                  const removeImage = () => {
                    field.onChange(undefined);
                    setNewsImagePreview("");
                  };

                  return (
                    <div className="space-y-2">
                      <Label htmlFor="imagen">Imagen de Perfil (Opcional)</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="imagen"
                          type="file"
                          accept="imagen/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('imagen')?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Subir Imagen
                        </Button>
                        {isUrl && (
                          <div className="relative">
                            <img
                              src={file as string}
                              alt="Imagen existente"
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
                        {isFile && newsImagePreview && (
                          <div className="relative">
                            <img
                              src={newsImagePreview}
                              alt="Vista previa"
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
                        {!newsImagePreview && editingUser?.imagen && (
                          <div className="text-muted-foreground">Imagen actual existente</div>
                        )}
                      </div>
                      {!file && (
                        <p className="text-muted-foreground">Sube una foto de perfil opcional (formato JPG, PNG)</p>
                      )}
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
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type='submit' disabled={isPosting || isPatching} className="bg-primary text-primary-foreground">
                {editingUser ? (isPatching ? 'Actualizando...' : 'Actualizar Usuario') : (isPosting ? 'Guardando...' : 'Guardar Usuario')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}