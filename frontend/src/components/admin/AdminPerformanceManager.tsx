import { useState, Fragment } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Plus, Edit, Trash2, Search, ChevronDown, ChevronRight, X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { type PerformanceData, performanceSchema } from '../../validations/performanceSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import {  usePerformance, usePerformancePost,  usePerformancePatch,  usePerformanceDelete } from '../../hooks/usePerformance';

interface Resource {
  id: string;
  nombre: string;
  unidad: string;
  cantidad: string;
}

interface Action {
  id: string;
  codigo: string;
  descripcion: string;
  unidad: string;
  categoria: string;
  recursos: Resource[];
}

export function AdminPerformanceManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<Action | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const { actions, refetch } = usePerformance();
  const { postPerformance } = usePerformancePost();
  const { patchPerformance } = usePerformancePatch();
  const { deletePerformance } = usePerformanceDelete();
  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<PerformanceData>({
    resolver: zodResolver(performanceSchema),
    defaultValues: {
      codigo: '',
      descripcion: '',
      unidad: '',
      categoria: '',
      recursos: [],
    },
  });

  // const [actions, setActions] = useState<Action[]>([
  //   {
  //     id: '1',
  //     codigo: 'ALB-001',
  //     descripcion: 'Muro de ladrillo gambote e=18cm (incl. mortero)',
  //     unidad: 'm²',
  //     categoria: 'Albañilería',
  //     recursos: [
  //       { id: '1-1', nombre: 'Ladrillo gambote', unidad: 'pza', cantidad: '37' },
  //       { id: '1-2', nombre: 'Cemento', unidad: 'kg', cantidad: '12.5' },
  //       { id: '1-3', nombre: 'Arena', unidad: 'm³', cantidad: '0.04' },
  //       { id: '1-4', nombre: 'Agua', unidad: 'lt', cantidad: '15' },
  //       { id: '1-5', nombre: 'Albañil', unidad: 'hr', cantidad: '1.2' },
  //       { id: '1-6', nombre: 'Ayudante', unidad: 'hr', cantidad: '1.2' },
  //     ],
  //   },
  //   {
  //     id: '2',
  //     codigo: 'HOA-002',
  //     descripcion: 'Hormigón armado f\'c=210 kg/cm² (incl. encofrado)',
  //     unidad: 'm³',
  //     categoria: 'Hormigón Armado',
  //     recursos: [
  //       { id: '2-1', nombre: 'Cemento Portland', unidad: 'kg', cantidad: '350' },
  //       { id: '2-2', nombre: 'Arena', unidad: 'm³', cantidad: '0.52' },
  //       { id: '2-3', nombre: 'Grava', unidad: 'm³', cantidad: '0.76' },
  //       { id: '2-4', nombre: 'Agua', unidad: 'lt', cantidad: '185' },
  //       { id: '2-5', nombre: 'Fierro corrugado', unidad: 'kg', cantidad: '120' },
  //       { id: '2-6', nombre: 'Alambre de amarre', unidad: 'kg', cantidad: '2.5' },
  //       { id: '2-7', nombre: 'Madera de encofrado', unidad: 'p²', cantidad: '8' },
  //       { id: '2-8', nombre: 'Clavos', unidad: 'kg', cantidad: '0.3' },
  //       { id: '2-9', nombre: 'Albañil especializado', unidad: 'hr', cantidad: '8' },
  //       { id: '2-10', nombre: 'Ayudante', unidad: 'hr', cantidad: '16' },
  //     ],
  //   },
  //   {
  //     id: '3',
  //     codigo: 'REV-003',
  //     descripcion: 'Revoque interior con yeso',
  //     unidad: 'm²',
  //     categoria: 'Revestimientos',
  //     recursos: [
  //       { id: '3-1', nombre: 'Yeso', unidad: 'kg', cantidad: '8' },
  //       { id: '3-2', nombre: 'Agua', unidad: 'lt', cantidad: '6' },
  //       { id: '3-3', nombre: 'Yesero', unidad: 'hr', cantidad: '0.4' },
  //       { id: '3-4', nombre: 'Ayudante', unidad: 'hr', cantidad: '0.2' },
  //     ],
  //   },
  //   {
  //     id: '4',
  //     codigo: 'CUB-004',
  //     descripcion: 'Cubierta de calamina galvanizada #28',
  //     unidad: 'm²',
  //     categoria: 'Cubiertas',
  //     recursos: [
  //       { id: '4-1', nombre: 'Calamina galvanizada #28', unidad: 'm²', cantidad: '1.1' },
  //       { id: '4-2', nombre: 'Cumbrera galvanizada', unidad: 'm', cantidad: '0.15' },
  //       { id: '4-3', nombre: 'Clavos para calamina', unidad: 'pza', cantidad: '18' },
  //       { id: '4-4', nombre: 'Tijerales de madera', unidad: 'pza', cantidad: '0.5' },
  //       { id: '4-5', nombre: 'Techador', unidad: 'hr', cantidad: '0.6' },
  //       { id: '4-6', nombre: 'Ayudante', unidad: 'hr', cantidad: '0.6' },
  //     ],
  //   },
  //   {
  //     id: '5',
  //     codigo: 'PIN-005',
  //     descripcion: 'Pintura látex interior (2 manos)',
  //     unidad: 'm²',
  //     categoria: 'Pintura',
  //     recursos: [
  //       { id: '5-1', nombre: 'Pintura látex', unidad: 'lt', cantidad: '0.25' },
  //       { id: '5-2', nombre: 'Sellador', unidad: 'lt', cantidad: '0.15' },
  //       { id: '5-3', nombre: 'Lija', unidad: 'plg', cantidad: '0.1' },
  //       { id: '5-4', nombre: 'Pintor', unidad: 'hr', cantidad: '0.35' },
  //     ],
  //   },
  //   {
  //     id: '6',
  //     codigo: 'EXC-006',
  //     descripcion: 'Excavación manual en terreno semi-duro',
  //     unidad: 'm³',
  //     categoria: 'Movimiento de Tierras',
  //     recursos: [
  //       { id: '6-1', nombre: 'Pala', unidad: 'hr', cantidad: '0.1' },
  //       { id: '6-2', nombre: 'Picota', unidad: 'hr', cantidad: '0.1' },
  //       { id: '6-3', nombre: 'Peón', unidad: 'hr', cantidad: '4.5' },
  //     ],
  //   },
  //   {
  //     id: '7',
  //     codigo: 'CER-007',
  //     descripcion: 'Cerámica para piso 40x40 cm',
  //     unidad: 'm²',
  //     categoria: 'Pisos',
  //     recursos: [
  //       { id: '7-1', nombre: 'Cerámica 40x40', unidad: 'm²', cantidad: '1.05' },
  //       { id: '7-2', nombre: 'Cemento cola', unidad: 'kg', cantidad: '5' },
  //       { id: '7-3', nombre: 'Fragua', unidad: 'kg', cantidad: '0.5' },
  //       { id: '7-4', nombre: 'Ceramista', unidad: 'hr', cantidad: '0.8' },
  //       { id: '7-5', nombre: 'Ayudante', unidad: 'hr', cantidad: '0.4' },
  //     ],
  //   },
  //   {
  //     id: '8',
  //     codigo: 'CAN-008',
  //     descripcion: 'Cañería PVC agua potable Ø 1/2"',
  //     unidad: 'm',
  //     categoria: 'Instalaciones Sanitarias',
  //     recursos: [
  //       { id: '8-1', nombre: 'Tubo PVC 1/2"', unidad: 'm', cantidad: '1.05' },
  //       { id: '8-2', nombre: 'Codos PVC 1/2"', unidad: 'pza', cantidad: '0.3' },
  //       { id: '8-3', nombre: 'Tees PVC 1/2"', unidad: 'pza', cantidad: '0.2' },
  //       { id: '8-4', nombre: 'Pegamento PVC', unidad: 'lt', cantidad: '0.05' },
  //       { id: '8-5', nombre: 'Cinta teflón', unidad: 'rollo', cantidad: '0.1' },
  //       { id: '8-6', nombre: 'Plomero', unidad: 'hr', cantidad: '0.4' },
  //       { id: '8-7', nombre: 'Ayudante', unidad: 'hr', cantidad: '0.2' },
  //     ],
  //   },
  //   {
  //     id: '9',
  //     codigo: 'CAR-009',
  //     descripcion: 'Carpintería de madera - puerta tablero',
  //     unidad: 'm²',
  //     categoria: 'Carpintería',
  //     recursos: [
  //       { id: '9-1', nombre: 'Madera mara', unidad: 'p²', cantidad: '5.5' },
  //       { id: '9-2', nombre: 'Triplay 4mm', unidad: 'plg', cantidad: '1.1' },
  //       { id: '9-3', nombre: 'Cola carpintero', unidad: 'kg', cantidad: '0.3' },
  //       { id: '9-4', nombre: 'Clavos', unidad: 'kg', cantidad: '0.2' },
  //       { id: '9-5', nombre: 'Laca', unidad: 'lt', cantidad: '0.4' },
  //       { id: '9-6', nombre: 'Carpintero', unidad: 'hr', cantidad: '3' },
  //     ],
  //   },
  //   {
  //     id: '10',
  //     codigo: 'ILE-010',
  //     descripcion: 'Instalación eléctrica - punto de luz',
  //     unidad: 'pto',
  //     categoria: 'Instalaciones Eléctricas',
  //     recursos: [
  //       { id: '10-1', nombre: 'Cable THW #14', unidad: 'm', cantidad: '8' },
  //       { id: '10-2', nombre: 'Tubo PVC eléctrico 3/4"', unidad: 'm', cantidad: '3' },
  //       { id: '10-3', nombre: 'Caja octogonal', unidad: 'pza', cantidad: '1' },
  //       { id: '10-4', nombre: 'Interruptor simple', unidad: 'pza', cantidad: '1' },
  //       { id: '10-5', nombre: 'Cinta aislante', unidad: 'rollo', cantidad: '0.1' },
  //       { id: '10-6', nombre: 'Electricista', unidad: 'hr', cantidad: '1.5' },
  //     ],
  //   },
  // ]);

  const filteredActions = (actions || []).filter(action => {
    const matchesSearch = 
      action.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.recursos.some(r => r.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || action.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleCreate = () => {
    setEditingAction(null);
    setResources([]);
    setIsActionDialogOpen(true);
    reset({
      codigo: '',
      descripcion: '',
      unidad: '',
      categoria: '',
      recursos: [],
    });
  };

  const handleEdit = (action: Action) => {
    reset({
      codigo: action.codigo,
      descripcion: action.descripcion,
      unidad: action.unidad,
      categoria: action.categoria,
      recursos: action.recursos,
    });
    setEditingAction(action);
    setResources([...action.recursos]);
    setIsActionDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta actividad?')) return;

    try {
      await deletePerformance(id);
      refetch();
    } catch (error) {
      alert('Error al eliminar la actividad');
      console.error(error);
    }
  };

  const handleSave = async (data: PerformanceData) => {
    try {
      if (editingAction && editingAction.id) {
        await patchPerformance(editingAction.id, data);
      } else {
        await postPerformance(data);
      }
      
      setIsActionDialogOpen(false);
      reset();
      setEditingAction(null);
      setResources([]);
      refetch();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al procesar la solicitud");
    }
  };

  const handleAddResource = () => {
    const newResource: Resource = {
      id: `${Date.now()}`,
      nombre: '',
      unidad: '',
      cantidad: '',
    };
    setResources([...resources, newResource]);
    setValue("recursos", [...resources, newResource], { shouldValidate: true });
  };

  const handleRemoveResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
    setValue("recursos", resources.filter(r => r.id !== id), { shouldValidate: true });
  };

  const categories = Array.from(new Set((actions || []).map(a => a.categoria)));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle>Gestión de Rendimientos</CardTitle>
              <CardDescription>Administra la tabla de rendimientos de actividades de construcción</CardDescription>
            </div>
            <Button onClick={handleCreate} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Actividad
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por actividad, código o recurso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 text-muted-foreground">
            Mostrando {filteredActions.length} de {actions.length} actividades
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="w-32">Código</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="w-24">Unidad</TableHead>
                  <TableHead className="w-48">Categoría</TableHead>
                  <TableHead className="w-32 text-center">Recursos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActions.map((action) => (
                  <Fragment key={action.id}>
                    {/* Main Row */}
                    <TableRow>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleRow(action.id)}
                        >
                          {expandedRows.has(action.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <code className="text-primary">{action.codigo}</code>
                      </TableCell>
                      <TableCell>{action.descripcion}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{action.unidad}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-secondary text-secondary-foreground">
                          {action.categoria}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{action.recursos.length}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(action)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(action.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Resources */}
                    {expandedRows.has(action.id) && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-muted/30 p-0">
                          <div className="px-12 py-4">
                            <h4 className="mb-3 text-foreground">Recursos Necesarios:</h4>
                            <Table>
                              <TableHeader>
                                <TableRow className="border-b">
                                  <TableHead className="h-8">Recurso</TableHead>
                                  <TableHead className="h-8 w-32">Unidad</TableHead>
                                  <TableHead className="h-8 w-32 text-right">Cantidad</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {action.recursos.map((resource) => (
                                  <TableRow key={resource.id} className="border-b last:border-0">
                                    <TableCell className="py-2">{resource.nombre}</TableCell>
                                    <TableCell className="py-2">
                                      <Badge variant="outline" className="bg-background">
                                        {resource.unidad}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="py-2 text-right">
                                      {resource.cantidad}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredActions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron actividades que coincidan con tu búsqueda.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit(handleSave)}>
            <DialogHeader>
              <DialogTitle>
                {editingAction ? 'Editar Actividad' : 'Nueva Actividad'}
              </DialogTitle>
              <DialogDescription>
                Completa los datos de la actividad y sus recursos necesarios
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold">Información Básica</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código</Label>
                    <Input 
                      id="codigo" 
                      placeholder="XXX-000" 
                      {...register("codigo")}
                    />
                    {errors.codigo && (
                      <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                        <AlertTitle className='text-sm'>Error en Código</AlertTitle>
                        <AlertDescription className='text-xs'>{errors.codigo.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidad">Unidad</Label>
                    <Input 
                      id="unidad" 
                      placeholder="m², m³, etc." 
                      {...register("unidad")}
                    />
                    {errors.unidad && (
                      <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                        <AlertTitle className='text-sm'>Error en Unidad</AlertTitle>
                        <AlertDescription className='text-xs'>{errors.unidad.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Input 
                    id="descripcion" 
                    placeholder="Descripción de la actividad" 
                    {...register("descripcion")}
                  />
                  {errors.descripcion && (
                    <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                      <AlertTitle className='text-sm'>Error en Descripción</AlertTitle>
                      <AlertDescription className='text-xs'>{errors.descripcion.message}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Controller 
                    control={control}
                    name="categoria"
                    render={({ field }) => (
                      <>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Albañilería">Albañilería</SelectItem>
                          <SelectItem value="Hormigón Armado">Hormigón Armado</SelectItem>
                          <SelectItem value="Revestimientos">Revestimientos</SelectItem>
                          <SelectItem value="Cubiertas">Cubiertas</SelectItem>
                          <SelectItem value="Pintura">Pintura</SelectItem>
                          <SelectItem value="Movimiento de Tierras">Movimiento de Tierras</SelectItem>
                          <SelectItem value="Pisos">Pisos</SelectItem>
                          <SelectItem value="Instalaciones Sanitarias">Instalaciones Sanitarias</SelectItem>
                          <SelectItem value="Carpintería">Carpintería</SelectItem>
                          <SelectItem value="Instalaciones Eléctricas">Instalaciones Eléctricas</SelectItem>
                          <SelectItem value="Otros">Otros</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.categoria && (
                        <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3 mt-1">
                          <AlertTitle className='text-sm'>Error en Categoría</AlertTitle>
                          <AlertDescription className='text-xs'>{errors.categoria.message}</AlertDescription>
                        </Alert>
                      )}
                      </>
                    )}
                  />
                </div>
              </div>

              {/* Resources */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Recursos</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddResource}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Recurso
                  </Button>
                </div>

                <div className="space-y-3">
                  <input type="hidden" {...register("recursos")} />
                  {errors.recursos && typeof errors.recursos.message === 'string' && (
                    <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3 mt-1">
                      <AlertTitle className='text-sm'>Error en Recursos</AlertTitle>
                      <AlertDescription className='text-xs'>{errors.recursos.message}</AlertDescription>
                    </Alert>
                  )}
                  {resources.map((resource, index) => (
                    <div key={resource.id} className="relative p-3 bg-muted/30 rounded-lg">
                      <div className='grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3'>
                        <div className="space-y-2">
                          <Label htmlFor={`resource-nombre-${resource.id}`}>Nombre del Recurso</Label>
                          <Input
                            id={`resource-nombre-${resource.id}`}
                            placeholder="Ej: Cemento, Ladrillo, Albañil"
                            {...register(`recursos.${index}.nombre`)}
                          />
                        {errors.recursos && errors.recursos[index]?.nombre && (
                          <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3 mt-1">
                            <AlertTitle className='text-sm'>Error en Nombre</AlertTitle>
                            <AlertDescription className='text-xs'>{errors.recursos[index].nombre.message}</AlertDescription>
                          </Alert>
                        )}
                        </div>
                        <div className="sm:w-32 space-y-2">
                          <Label htmlFor={`resource-unidad-${resource.id}`}>Unidad</Label>
                          <Input
                            id={`resource-unidad-${resource.id}`}
                            placeholder="kg, m³, hr"
                            {...register(`recursos.${index}.unidad`)}
                          />
                        {errors.recursos && errors.recursos[index]?.unidad && (
                          <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3 mt-1">
                            <AlertTitle className='text-sm'>Error en Unidad</AlertTitle>
                            <AlertDescription className='text-xs'>{errors.recursos[index].unidad.message}</AlertDescription>
                          </Alert>
                        )}
                        </div>
                        <div className="sm:w-32 space-y-2">
                          <Label htmlFor={`resource-cantidad-${resource.id}`}>Cantidad</Label>
                          <Input
                            id={`resource-cantidad-${resource.id}`}
                            placeholder="0"
                            {...register(`recursos.${index}.cantidad`)}
                          />
                        {errors.recursos && errors.recursos[index]?.cantidad && (
                          <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3 mt-1">
                            <AlertTitle className='text-sm'>Error en Cantidad</AlertTitle>
                            <AlertDescription className='text-xs'>{errors.recursos[index].cantidad.message}</AlertDescription>
                          </Alert>
                        )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveResource(resource.id)}
                          className="absolute top-2 right-2 text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {resources.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay recursos agregados. Haz clic en "Agregar Recurso" para añadir.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type='submit' className="bg-primary text-primary-foreground">
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
