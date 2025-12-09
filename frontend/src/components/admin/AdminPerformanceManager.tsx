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
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { type PerformancePostData } from '../../validations/performanceSchema';

interface Resource {
  id: string;
  name: string;
  unit: string;
  quantity: number;
}

interface Action {
  id: string;
  code: string;
  description: string;
  unit: string;
  category: string;
  resources: Resource[];
}

export function AdminPerformanceManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<Action | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<PerformancePostData>();

  const [actions, setActions] = useState<Action[]>([
    {
      id: '1',
      code: 'ALB-001',
      description: 'Muro de ladrillo gambote e=18cm (incl. mortero)',
      unit: 'm²',
      category: 'Albañilería',
      resources: [
        { id: '1-1', name: 'Ladrillo gambote', unit: 'pza', quantity: 37 },
        { id: '1-2', name: 'Cemento', unit: 'kg', quantity: 12.5 },
        { id: '1-3', name: 'Arena', unit: 'm³', quantity: 0.04 },
        { id: '1-4', name: 'Agua', unit: 'lt', quantity: 15 },
        { id: '1-5', name: 'Albañil', unit: 'hr', quantity: 1.2 },
        { id: '1-6', name: 'Ayudante', unit: 'hr', quantity: 1.2 },
      ],
    },
    {
      id: '2',
      code: 'HOA-002',
      description: 'Hormigón armado f\'c=210 kg/cm² (incl. encofrado)',
      unit: 'm³',
      category: 'Hormigón Armado',
      resources: [
        { id: '2-1', name: 'Cemento Portland', unit: 'kg', quantity: 350 },
        { id: '2-2', name: 'Arena', unit: 'm³', quantity: 0.52 },
        { id: '2-3', name: 'Grava', unit: 'm³', quantity: 0.76 },
        { id: '2-4', name: 'Agua', unit: 'lt', quantity: 185 },
        { id: '2-5', name: 'Fierro corrugado', unit: 'kg', quantity: 120 },
        { id: '2-6', name: 'Alambre de amarre', unit: 'kg', quantity: 2.5 },
        { id: '2-7', name: 'Madera de encofrado', unit: 'p²', quantity: 8 },
        { id: '2-8', name: 'Clavos', unit: 'kg', quantity: 0.3 },
        { id: '2-9', name: 'Albañil especializado', unit: 'hr', quantity: 8 },
        { id: '2-10', name: 'Ayudante', unit: 'hr', quantity: 16 },
      ],
    },
    {
      id: '3',
      code: 'REV-003',
      description: 'Revoque interior con yeso',
      unit: 'm²',
      category: 'Revestimientos',
      resources: [
        { id: '3-1', name: 'Yeso', unit: 'kg', quantity: 8 },
        { id: '3-2', name: 'Agua', unit: 'lt', quantity: 6 },
        { id: '3-3', name: 'Yesero', unit: 'hr', quantity: 0.4 },
        { id: '3-4', name: 'Ayudante', unit: 'hr', quantity: 0.2 },
      ],
    },
    {
      id: '4',
      code: 'CUB-004',
      description: 'Cubierta de calamina galvanizada #28',
      unit: 'm²',
      category: 'Cubiertas',
      resources: [
        { id: '4-1', name: 'Calamina galvanizada #28', unit: 'm²', quantity: 1.1 },
        { id: '4-2', name: 'Cumbrera galvanizada', unit: 'm', quantity: 0.15 },
        { id: '4-3', name: 'Clavos para calamina', unit: 'pza', quantity: 18 },
        { id: '4-4', name: 'Tijerales de madera', unit: 'pza', quantity: 0.5 },
        { id: '4-5', name: 'Techador', unit: 'hr', quantity: 0.6 },
        { id: '4-6', name: 'Ayudante', unit: 'hr', quantity: 0.6 },
      ],
    },
    {
      id: '5',
      code: 'PIN-005',
      description: 'Pintura látex interior (2 manos)',
      unit: 'm²',
      category: 'Pintura',
      resources: [
        { id: '5-1', name: 'Pintura látex', unit: 'lt', quantity: 0.25 },
        { id: '5-2', name: 'Sellador', unit: 'lt', quantity: 0.15 },
        { id: '5-3', name: 'Lija', unit: 'plg', quantity: 0.1 },
        { id: '5-4', name: 'Pintor', unit: 'hr', quantity: 0.35 },
      ],
    },
    {
      id: '6',
      code: 'EXC-006',
      description: 'Excavación manual en terreno semi-duro',
      unit: 'm³',
      category: 'Movimiento de Tierras',
      resources: [
        { id: '6-1', name: 'Pala', unit: 'hr', quantity: 0.1 },
        { id: '6-2', name: 'Picota', unit: 'hr', quantity: 0.1 },
        { id: '6-3', name: 'Peón', unit: 'hr', quantity: 4.5 },
      ],
    },
    {
      id: '7',
      code: 'CER-007',
      description: 'Cerámica para piso 40x40 cm',
      unit: 'm²',
      category: 'Pisos',
      resources: [
        { id: '7-1', name: 'Cerámica 40x40', unit: 'm²', quantity: 1.05 },
        { id: '7-2', name: 'Cemento cola', unit: 'kg', quantity: 5 },
        { id: '7-3', name: 'Fragua', unit: 'kg', quantity: 0.5 },
        { id: '7-4', name: 'Ceramista', unit: 'hr', quantity: 0.8 },
        { id: '7-5', name: 'Ayudante', unit: 'hr', quantity: 0.4 },
      ],
    },
    {
      id: '8',
      code: 'CAN-008',
      description: 'Cañería PVC agua potable Ø 1/2"',
      unit: 'm',
      category: 'Instalaciones Sanitarias',
      resources: [
        { id: '8-1', name: 'Tubo PVC 1/2"', unit: 'm', quantity: 1.05 },
        { id: '8-2', name: 'Codos PVC 1/2"', unit: 'pza', quantity: 0.3 },
        { id: '8-3', name: 'Tees PVC 1/2"', unit: 'pza', quantity: 0.2 },
        { id: '8-4', name: 'Pegamento PVC', unit: 'lt', quantity: 0.05 },
        { id: '8-5', name: 'Cinta teflón', unit: 'rollo', quantity: 0.1 },
        { id: '8-6', name: 'Plomero', unit: 'hr', quantity: 0.4 },
        { id: '8-7', name: 'Ayudante', unit: 'hr', quantity: 0.2 },
      ],
    },
    {
      id: '9',
      code: 'CAR-009',
      description: 'Carpintería de madera - puerta tablero',
      unit: 'm²',
      category: 'Carpintería',
      resources: [
        { id: '9-1', name: 'Madera mara', unit: 'p²', quantity: 5.5 },
        { id: '9-2', name: 'Triplay 4mm', unit: 'plg', quantity: 1.1 },
        { id: '9-3', name: 'Cola carpintero', unit: 'kg', quantity: 0.3 },
        { id: '9-4', name: 'Clavos', unit: 'kg', quantity: 0.2 },
        { id: '9-5', name: 'Laca', unit: 'lt', quantity: 0.4 },
        { id: '9-6', name: 'Carpintero', unit: 'hr', quantity: 3 },
      ],
    },
    {
      id: '10',
      code: 'ILE-010',
      description: 'Instalación eléctrica - punto de luz',
      unit: 'pto',
      category: 'Instalaciones Eléctricas',
      resources: [
        { id: '10-1', name: 'Cable THW #14', unit: 'm', quantity: 8 },
        { id: '10-2', name: 'Tubo PVC eléctrico 3/4"', unit: 'm', quantity: 3 },
        { id: '10-3', name: 'Caja octogonal', unit: 'pza', quantity: 1 },
        { id: '10-4', name: 'Interruptor simple', unit: 'pza', quantity: 1 },
        { id: '10-5', name: 'Cinta aislante', unit: 'rollo', quantity: 0.1 },
        { id: '10-6', name: 'Electricista', unit: 'hr', quantity: 1.5 },
      ],
    },
  ]);

  const filteredActions = actions.filter(action => {
    const matchesSearch = 
      action.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.resources.some(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || action.category === filterCategory;
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
  };

  const handleEdit = (action: Action) => {
    setEditingAction(action);
    setResources([...action.resources]);
    setIsActionDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta actividad?')) {
      setActions(actions.filter(a => a.id !== id));
    }
  };

  const handleSave = (data: PerformancePostData) => {
    console.log('Guardando actividad');
    setIsActionDialogOpen(false);
    console.log('Datos guardados: ', data);
    // Lógica para guardar
  };

  const handleAddResource = () => {
    const newResource: Resource = {
      id: `${Date.now()}`,
      name: '',
      unit: '',
      quantity: 0
    };
    setResources([...resources, newResource]);
  };

  const handleRemoveResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const handleResourceChange = (id: string, field: keyof Resource, value: string | number) => {
    setResources(resources.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const categories = Array.from(new Set(actions.map(a => a.category)));

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
                        <code className="text-primary">{action.code}</code>
                      </TableCell>
                      <TableCell>{action.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{action.unit}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-secondary text-secondary-foreground">
                          {action.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{action.resources.length}</Badge>
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
                                {action.resources.map((resource) => (
                                  <TableRow key={resource.id} className="border-b last:border-0">
                                    <TableCell className="py-2">{resource.name}</TableCell>
                                    <TableCell className="py-2">
                                      <Badge variant="outline" className="bg-background">
                                        {resource.unit}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="py-2 text-right">
                                      {resource.quantity}
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
                    <Label htmlFor="code">Código</Label>
                    <Input 
                      id="code" 
                      placeholder="XXX-000" 
                      defaultValue={editingAction?.code} 
                      {...register("codigo")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unidad</Label>
                    <Input 
                      id="unit" 
                      placeholder="m², m³, etc." 
                      defaultValue={editingAction?.unit} 
                      {...register("unidad")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input 
                    id="description" 
                    placeholder="Descripción de la actividad" 
                    defaultValue={editingAction?.description} 
                    {...register("descripcion")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Controller 
                    control={control}
                    name="recursos"
                    render={({ field }) => (
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
                  {resources.map((resource, index) => (
                    <div key={resource.id} className="relative p-3 bg-muted/30 rounded-lg">
                      <div className='grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3'>
                        <div className="space-y-2">
                          <Label htmlFor={`resource-name-${resource.id}`}>Nombre del Recurso</Label>
                          <Input
                            id={`resource-name-${resource.id}`}
                            placeholder="Ej: Cemento, Ladrillo, Albañil"
                            // value={resource.name}
                            // onChange={(e) => handleResourceChange(resource.id, 'name', e.target.value)}
                            {...register(`recursos.${index}.nombre`)}
                          />
                        </div>
                        <div className="sm:w-32 space-y-2">
                          <Label htmlFor={`resource-unit-${resource.id}`}>Unidad</Label>
                          <Input
                            id={`resource-unit-${resource.id}`}
                            placeholder="kg, m³, hr"
                            // value={resource.unit}
                            // onChange={(e) => handleResourceChange(resource.id, 'unit', e.target.value)}
                            {...register(`recursos.${index}.unidad`)}
                          />
                        </div>
                        <div className="sm:w-32 space-y-2">
                          <Label htmlFor={`resource-quantity-${resource.id}`}>Cantidad</Label>
                          <Input
                            id={`resource-quantity-${resource.id}`}
                            type="number"
                            step="0.01"
                            placeholder="0"
                            // value={resource.quantity}
                            // onChange={(e) => handleResourceChange(resource.id, 'quantity', parseFloat(e.target.value) || 0)}
                            {...register(`recursos.${index}.cantidad`)}
                          />
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
