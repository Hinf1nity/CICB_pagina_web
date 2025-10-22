import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export function AdminNewsPage() {
  const [activeTab, setActiveTab] = useState('news');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const newsItems = [
    { id: 1, title: 'Convocatoria Asamblea General', category: 'Institucional', status: 'Publicado', date: '2025-10-22' },
    { id: 2, title: 'Nuevo Reglamento de Proyectos', category: 'Normativa', status: 'Publicado', date: '2025-10-18' },
    { id: 3, title: 'Seminario Internacional', category: 'Eventos', status: 'Borrador', date: '2025-10-15' },
  ];

  const jobsItems = [
    { id: 1, title: 'Ingeniero Civil Senior', company: 'Constructora Andes', status: 'Activo', date: '2025-10-20' },
    { id: 2, title: 'Ingeniero Estructural', company: 'Diseños Bolivia', status: 'Activo', date: '2025-10-18' },
    { id: 3, title: 'Supervisor de Obra', company: 'Energía Limpia', status: 'Expirado', date: '2025-10-15' },
  ];

  const handleCreate = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este elemento?')) {
      console.log('Eliminando:', id);
    }
  };

  const handleSave = () => {
    setIsDialogOpen(false);
    // Lógica para guardar
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="mb-3">Administración de Contenido</h1>
          <p>Gestiona noticias y ofertas laborales del portal</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="news">Noticias</TabsTrigger>
            <TabsTrigger value="jobs">Trabajos</TabsTrigger>
          </TabsList>

          {/* News Tab */}
          <TabsContent value="news" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestión de Noticias</CardTitle>
                    <CardDescription>Administra las noticias publicadas en el portal</CardDescription>
                  </div>
                  <Button onClick={handleCreate} className="bg-primary text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Noticia
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newsItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={item.status === 'Publicado' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-foreground'}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(item.date).toLocaleDateString('es-BO')}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestión de Ofertas Laborales</CardTitle>
                    <CardDescription>Administra las ofertas de trabajo publicadas</CardDescription>
                  </div>
                  <Button onClick={handleCreate} className="bg-primary text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Oferta
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobsItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.company}</TableCell>
                          <TableCell>
                            <Badge className={item.status === 'Activo' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-foreground'}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(item.date).toLocaleDateString('es-BO')}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar' : 'Crear'} {activeTab === 'news' ? 'Noticia' : 'Oferta Laboral'}
              </DialogTitle>
              <DialogDescription>
                Completa los campos para {editingItem ? 'actualizar' : 'crear'} el contenido
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {activeTab === 'news' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input id="title" placeholder="Título de la noticia" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="institucional">Institucional</SelectItem>
                        <SelectItem value="normativa">Normativa</SelectItem>
                        <SelectItem value="eventos">Eventos</SelectItem>
                        <SelectItem value="premios">Premios</SelectItem>
                        <SelectItem value="capacitacion">Capacitación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Extracto</Label>
                    <Textarea id="excerpt" placeholder="Breve descripción" rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Contenido</Label>
                    <Textarea id="content" placeholder="Contenido completo de la noticia" rows={6} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="borrador">Borrador</SelectItem>
                        <SelectItem value="publicado">Publicado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Título del Puesto</Label>
                    <Input id="jobTitle" placeholder="Título de la oferta laboral" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input id="company" placeholder="Nombre de la empresa" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Ubicación</Label>
                      <Input id="location" placeholder="Ciudad" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de trabajo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completo">Tiempo Completo</SelectItem>
                          <SelectItem value="contrato">Contrato</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salario</Label>
                    <Input id="salary" placeholder="Rango salarial" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea id="description" placeholder="Descripción del puesto" rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requisitos</Label>
                    <Textarea id="requirements" placeholder="Requisitos (uno por línea)" rows={4} />
                  </div>
                </>
              )}
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
