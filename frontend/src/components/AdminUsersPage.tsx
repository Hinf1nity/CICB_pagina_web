import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Plus, Edit, Trash2, Search, UserCheck, UserX } from 'lucide-react';

export function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const users = [
    { id: 1, name: 'Juan Carlos Pérez', registration: 'CICB-LP-1234', email: 'juan.perez@email.com', specialty: 'Estructural', city: 'La Paz', status: 'Activo', role: 'Miembro' },
    { id: 2, name: 'María Elena Torres', registration: 'CICB-SC-2345', email: 'maria.torres@email.com', specialty: 'Hidráulica', city: 'Santa Cruz', status: 'Activo', role: 'Miembro' },
    { id: 3, name: 'Roberto Sánchez', registration: 'CICB-CB-3456', email: 'roberto.sanchez@email.com', specialty: 'Vial', city: 'Cochabamba', status: 'Pendiente', role: 'Miembro' },
    { id: 4, name: 'Ana Gabriela Morales', registration: 'CICB-LP-4567', email: 'ana.morales@email.com', specialty: 'Geotecnia', city: 'La Paz', status: 'Activo', role: 'Administrador' },
    { id: 5, name: 'Luis Fernando Ramos', registration: 'CICB-TJ-5678', email: 'luis.ramos@email.com', specialty: 'Estructural', city: 'Tarija', status: 'Suspendido', role: 'Miembro' },
    { id: 6, name: 'Patricia Guzmán', registration: 'CICB-SC-6789', email: 'patricia.guzman@email.com', specialty: 'Ambiental', city: 'Santa Cruz', status: 'Activo', role: 'Miembro' },
    { id: 7, name: 'Diego Alvarado', registration: 'CICB-LP-7890', email: 'diego.alvarado@email.com', specialty: 'Construcción', city: 'La Paz', status: 'Activo', role: 'Miembro' },
    { id: 8, name: 'Carmen Flores', registration: 'CICB-OR-8901', email: 'carmen.flores@email.com', specialty: 'Vial', city: 'Oruro', status: 'Pendiente', role: 'Miembro' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (user: any) => {
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

  const handleSave = () => {
    setIsDialogOpen(false);
    // Lógica para guardar
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Activo': 'bg-secondary text-secondary-foreground',
      'Pendiente': 'bg-accent text-accent-foreground',
      'Suspendido': 'bg-destructive text-destructive-foreground',
    };
    return colors[status] || 'bg-muted text-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="mb-3">Administración de Usuarios</h1>
          <p>Gestiona los miembros registrados en el sistema</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
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
                  placeholder="Buscar por nombre, registro o email..."
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
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Suspendido">Suspendido</SelectItem>
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
                    <TableHead>Registro</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>Ciudad</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.registration}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.specialty}</Badge>
                      </TableCell>
                      <TableCell>{user.city}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            title={user.status === 'Activo' ? 'Suspender' : 'Activar'}
                          >
                            {user.status === 'Activo' ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
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
          <DialogContent className="max-w-2xl">
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
                  <Input id="name" placeholder="Nombre completo" defaultValue={editingUser?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration">Número de Registro</Label>
                  <Input id="registration" placeholder="CICB-XX-XXXX" defaultValue={editingUser?.registration} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" placeholder="correo@email.com" defaultValue={editingUser?.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="+591 XXXXXXXX" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidad</Label>
                  <Select defaultValue={editingUser?.specialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Estructural">Estructural</SelectItem>
                      <SelectItem value="Hidráulica">Hidráulica</SelectItem>
                      <SelectItem value="Vial">Vial</SelectItem>
                      <SelectItem value="Geotecnia">Geotecnia</SelectItem>
                      <SelectItem value="Ambiental">Ambiental</SelectItem>
                      <SelectItem value="Construcción">Construcción</SelectItem>
                      <SelectItem value="Sanitaria">Sanitaria</SelectItem>
                      <SelectItem value="Transporte">Transporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Select defaultValue={editingUser?.city}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="La Paz">La Paz</SelectItem>
                      <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                      <SelectItem value="Cochabamba">Cochabamba</SelectItem>
                      <SelectItem value="Tarija">Tarija</SelectItem>
                      <SelectItem value="Oruro">Oruro</SelectItem>
                      <SelectItem value="Potosí">Potosí</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select defaultValue={editingUser?.role || 'Miembro'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Miembro">Miembro</SelectItem>
                      <SelectItem value="Administrador">Administrador</SelectItem>
                      <SelectItem value="Moderador">Moderador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select defaultValue={editingUser?.status || 'Pendiente'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Suspendido">Suspendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
