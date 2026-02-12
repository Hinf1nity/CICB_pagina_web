import { useState, Fragment, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Plus, Edit, Trash2, Search, ChevronDown, ChevronRight, X, ListChecks, Package } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { type PerformanceData, type Recurso, performanceSchema, recursoSchema } from '../../validations/performanceSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import {
  usePerformance,
  usePerformancePost,
  usePerformancePatch,
  usePerformanceDelete,
  searchResourceByName,
  useResources,
  useResourcesPost,
  useResourcesPatch,
  useResourcesDelete,
} from '../../hooks/usePerformance';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useDebounce } from 'use-debounce';


export function AdminPerformanceManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<PerformanceData | null>(null);
  const [resources, setResources] = useState<Recurso[]>([]);
  const [catalogSearchTerm, setCatalogSearchTerm] = useState('');
  const [isResourceCatalogDialogOpen, setIsResourceCatalogDialogOpen] = useState(false);
  const [editingCatalogResource, setEditingCatalogResource] = useState<Recurso | null>(null);
  const [isResourceSelectorOpen, setIsResourceSelectorOpen] = useState(false);
  const [resourceSelectorSearch, setResourceSelectorSearch] = useState('');
  const [resourcePage, setResourcePage] = useState(1);
  const [actionPage, setActionPage] = useState(1);
  const [debouncedSearchTermActions] = useDebounce(searchTerm, 500);
  useEffect(() => {
    setActionPage(1); // Reset to first page on new search or filter
  }, [debouncedSearchTermActions, filterCategory]);
  const [debouncedCatalogSearchTerm] = useDebounce(catalogSearchTerm, 500);
  useEffect(() => {
    setResourcePage(1); // Reset to first page on new search
  }, [debouncedCatalogSearchTerm]);
  const { actions, count: countActions, next: nextAction, previous: previousAction, categories_names } = usePerformance(actionPage, debouncedSearchTermActions, filterCategory);
  const pageSize = 20; // Paginacion se agrega esto y el count de arriba
  const totalPagesActions = countActions ? Math.ceil(countActions / pageSize) : 1;
  const { mutate: postPerformance, isPending: isPostingPerformance } = usePerformancePost();
  const { mutate: patchPerformance, isPending: isPatchingPerformance } = usePerformancePatch();
  const { mutate: deletePerformance } = usePerformanceDelete();
  const { resources: searchedResources } = searchResourceByName(resourceSelectorSearch);
  const { resources: resourceCatalog, count: countResources, next: nextResource, previous: previousResource } = useResources(resourcePage, debouncedCatalogSearchTerm);
  const totalPagesResources = countResources ? Math.ceil(countResources / pageSize) : 1;
  const { mutate: postResource, isPending: isPostingResource } = useResourcesPost();
  const { mutate: patchResource, isPending: isPatchingResource } = useResourcesPatch();
  const { mutate: deleteResource } = useResourcesDelete();
  const { register, control, handleSubmit, reset, formState: { errors }, getValues, setValue } = useForm<PerformanceData>({
    resolver: zodResolver(performanceSchema),
    defaultValues: {
      codigo: '',
      actividad: '',
      unidad: '',
      categoria: '',
      recursos_info: [],
    },
  });
  const { register: registerCatalog, handleSubmit: handleSubmitCatalog, reset: resetCatalog, formState: { errors: errorsCatalog } } = useForm<Recurso>({
    resolver: zodResolver(recursoSchema),
    defaultValues: {
      nombre: '',
      unidad: '',
    },
  });

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id.toString())) {
      newExpanded.delete(id.toString());
    } else {
      newExpanded.add(id.toString());
    }
    setExpandedRows(newExpanded);
  };

  const handleCreate = () => {
    setEditingAction(null);
    setResources([]);
    setIsActionDialogOpen(true);
    reset({
      codigo: '',
      actividad: '',
      unidad: '',
      categoria: '',
      recursos_info: [],
    });
  };

  const handleEdit = (action: PerformanceData) => {
    reset({
      codigo: action.codigo,
      actividad: action.actividad,
      unidad: action.unidad,
      categoria: action.categoria,
      recursos_info: action.recursos_info,
    });
    setEditingAction({
      ...action,
      recursos_info: action.recursos_info.map(ri => ({ ...ri, recurso: typeof ri.recurso === 'object' && ri.recurso !== null && 'id' in ri.recurso
        ? ri.recurso.id?.toString() ?? "" 
        : ri.recurso.toString(), // Si ya es un string (o el ID), lo usamos directamente
      cantidad: ri.cantidad })),
    });
    setResources([...action.recursos_info.map(ri => typeof ri.recurso === 'object' ? {
      id: ri.recurso.id,
      nombre: ri.recurso.nombre,
      unidad: ri.recurso.unidad,
    } : {
      id: undefined,
      nombre: '',
      unidad: '',
    })]);
    setIsActionDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta actividad?')) return;

    try {
      deletePerformance(id);
    } catch (error) {
      alert('Error al eliminar la actividad');
      console.error(error);
    }
  };

  const handleSave = async (data: PerformanceData) => {
    try {
      if (editingAction && editingAction.id) {
        data.recursos_info = resources.map((r, index) => ({
          recurso: r.id!.toString(),
          cantidad: data.recursos_info[index]?.cantidad,
        }));
        patchPerformance({ id: editingAction.id.toString(), data, oldData: editingAction }, {
          onSuccess: () => {
            setIsActionDialogOpen(false);
            reset();
            setEditingAction(null);
            setResources([]);
          }
        });
      } else {
        postPerformance(data, {
          onSuccess: () => {
            setIsActionDialogOpen(false);
            reset();
            setEditingAction(null);
            setResources([]);
          }
        });
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al procesar la solicitud");
    }
  };

  const handleAddResourceFromCatalog = (catalogResource: Recurso) => {
    const newResource: Recurso = {
      id: catalogResource.id,
      nombre: catalogResource.nombre,
      unidad: catalogResource.unidad,
    };
    setResources([...resources, newResource]);
    setIsResourceSelectorOpen(false);
    setResourceSelectorSearch('');
  };

  const handleRemoveResource = (id: string, index: number) => {
    setResources(resources.filter(r => r.id?.toString() !== id));
    const currentResources = getValues('recursos_info');
    const updatedResources = currentResources.filter((_, i) => i !== index);
    setValue('recursos_info', updatedResources);
  };

  const handleEditCatalogResource = (resource: Recurso) => {
    resetCatalog({
      nombre: resource.nombre,
      unidad: resource.unidad,
    });
    setEditingCatalogResource(resource);
    setIsResourceCatalogDialogOpen(true);
  };

  const handleDeleteCatalogResource = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este recurso del catálogo?')) {
      try {
        deleteResource(id);
      } catch (error) {
        alert('Error al eliminar el recurso del catálogo');
        console.error(error);
      }
    }
  };

  const handleSaveCatalogResource = (data: Recurso) => {
    if (editingCatalogResource) {
      // Lógica para actualizar recurso existente
      patchResource({ id: editingCatalogResource.id!.toString(), data, oldData: editingCatalogResource }, {
        onSuccess: () => {
          setEditingCatalogResource(null);
          setIsResourceCatalogDialogOpen(false);
          resetCatalog();
        }
      });
    } else {
      // Lógica para crear nuevo recurso
      postResource(data, {
        onSuccess: () => {
          setIsResourceCatalogDialogOpen(false);
          resetCatalog();
        }
      });
    }
  };

  return (
    <Tabs defaultValue="activities" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="activities">
          <ListChecks className="w-4 h-4 mr-2" />
          Actividades
        </TabsTrigger>
        <TabsTrigger value="catalog">
          <Package className="w-4 h-4 mr-2" />
          Catálogo de Recursos
        </TabsTrigger>
      </TabsList>

      {/* Activities Tab */}
      <TabsContent value="activities" className="space-y-6">
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
                  {categories_names.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 text-muted-foreground">
              Mostrando {1 + (actionPage - 1) * pageSize}-{Math.min(actionPage * pageSize, countActions)} de {countActions} noticias
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
                  {actions.map((action) => (
                    <Fragment key={action.id}>
                      {/* Main Row */}
                      <TableRow>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleRow(action.id!)}
                          >
                            {expandedRows.has(action.id!.toString()) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <code className="text-primary">{action.codigo}</code>
                        </TableCell>
                        <TableCell>{action.actividad}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{action.unidad}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-secondary text-secondary-foreground">
                            {action.categoria}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{action.recursos_info.length}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(action)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(action.id!.toString())}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Resources */}
                      {expandedRows.has(action.id!.toString()) && (
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
                                  {action.recursos_info.map((resource, index) => (
                                    <TableRow key={typeof resource.recurso === 'object' ? resource.recurso.id : index} className="border-b last:border-0">
                                      <TableCell className="py-2">{typeof resource.recurso === 'object' ? resource.recurso.nombre : ''}</TableCell>
                                      <TableCell className="py-2">
                                        <Badge variant="outline" className="bg-background">
                                          {typeof resource.recurso === 'object' ? resource.recurso.unidad : ''}
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
              {/* creamos la paginacion y sus flechas */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!previousAction}
                  onClick={() => setActionPage((p) => Math.max(p - 1, 1))}
                >
                  Anterior
                </Button>

                <span className="text-sm text-muted-foreground">
                  Página {actionPage} de {totalPagesActions}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!nextAction}
                  onClick={() => setActionPage((p) => p + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>

            {countActions === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron actividades que coincidan con tu búsqueda.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Resource Catalog Tab */}
      <TabsContent value="catalog" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle>Catálogo de Recursos</CardTitle>
                <CardDescription>Administra el catálogo de recursos disponibles para las actividades</CardDescription>
              </div>
              <Button onClick={() => setIsResourceCatalogDialogOpen(true)} className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Recurso
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar recurso..."
                  value={catalogSearchTerm}
                  onChange={(e) => setCatalogSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="mt-4 text-muted-foreground">
              Mostrando {1 + (resourcePage - 1) * pageSize}-{Math.min(resourcePage * pageSize, countResources)} de {countResources} recursos
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre del Recurso</TableHead>
                    <TableHead className="w-32">Unidad</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resourceCatalog.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell>{resource.nombre}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{resource.unidad}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => resource.id !== undefined && handleEditCatalogResource({ ...resource, id: resource.id })}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCatalogResource(resource.id!.toString())}>
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
                  disabled={!previousResource}
                  onClick={() => setResourcePage((p) => Math.max(p - 1, 1))}
                >
                  Anterior
                </Button>

                <span className="text-sm text-muted-foreground">
                  Página {resourcePage} de {totalPagesResources}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!nextResource}
                  onClick={() => setResourcePage((p) => p + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>

            {countResources === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron recursos que coincidan con tu búsqueda.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Create/Edit Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
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
                    id="actividad"
                    placeholder="Descripción de la actividad"
                    {...register("actividad")}
                  />
                  {errors.actividad && (
                    <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                      <AlertTitle className='text-sm'>Error en Descripción</AlertTitle>
                      <AlertDescription className='text-xs'>{errors.actividad.message}</AlertDescription>
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
                    onClick={() => setIsResourceSelectorOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Recurso
                  </Button>
                </div>

                <div className="space-y-3">
                  <input type="hidden" {...register("recursos_info")} />
                  {errors.recursos_info && typeof errors.recursos_info.message === 'string' && (
                    <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3 mt-1">
                      <AlertTitle className='text-sm'>Error en Recursos</AlertTitle>
                      <AlertDescription className='text-xs'>{errors.recursos_info.message}</AlertDescription>
                    </Alert>
                  )}
                  {resources.map((resource, index) => (
                    <div key={resource.id} className="relative p-3 bg-muted/30 rounded-lg">
                      <input type="hidden" value={resource.id} {...register(`recursos_info.${index}.recurso`)} />
                      <div className='grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3'>
                        <div className="space-y-2">
                          <Label htmlFor={`resource-nombre-${resource.id}`}>Nombre del Recurso</Label>
                          <Input
                            id={`resource-nombre-${resource.id}`}
                            placeholder="Ej: Cemento, Ladrillo, Albañil"
                            disabled
                            value={resource.nombre}
                          />
                        </div>
                        <div className="sm:w-32 space-y-2">
                          <Label htmlFor={`resource-unidad-${resource.id}`}>Unidad</Label>
                          <Input
                            id={`resource-unidad-${resource.id}`}
                            placeholder="kg, m³, hr"
                            disabled
                            value={resource.unidad}
                          />
                        </div>
                        <div className="sm:w-32 space-y-2">
                          <Label htmlFor={`resource-cantidad-${resource.id}`}>Cantidad</Label>
                          <Input
                            id={`resource-cantidad-${resource.id}`}
                            placeholder="0"
                            {...register(`recursos_info.${index}.cantidad`)}
                          />
                          {errors.recursos_info && errors.recursos_info[index]?.cantidad && (
                            <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3 mt-1">
                              <AlertTitle className='text-sm'>Error en Cantidad</AlertTitle>
                              <AlertDescription className='text-xs'>{errors.recursos_info[index].cantidad.message}</AlertDescription>
                            </Alert>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveResource(resource.id!.toString(), index)}
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
              <Button type="button" variant="outline" onClick={() => setIsActionDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type='submit' disabled={isPostingPerformance || isPatchingPerformance} className="bg-primary text-primary-foreground">
                {editingAction ? (isPatchingPerformance ? 'Actualizando...' : 'Actualizar Rendimiento') : (isPostingPerformance ? 'Guardando...' : 'Guardar Rendimiento')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Resource Selector Dialog */}
      <Dialog open={isResourceSelectorOpen} onOpenChange={setIsResourceSelectorOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Seleccionar Recurso</DialogTitle>
            <DialogDescription>
              Busca y selecciona un recurso del catálogo para agregar a la actividad
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar recurso..."
                value={resourceSelectorSearch}
                onChange={(e) => setResourceSelectorSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Resources List */}
            <div className="border rounded-md max-h-[400px] overflow-y-auto">
              <>
                {/* Agrupación dinámica por categoría */}
                {searchedResources
                  .map((resource: Recurso) => (
                    <button
                      type='button'
                      key={resource.id}
                      onClick={() => handleAddResourceFromCatalog(resource)}
                      className="w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{resource.nombre}</span>
                        <Badge variant="secondary">{resource.unidad}</Badge>
                      </div>
                    </button>
                  ))}

                {searchedResources.length === 0 && resourceSelectorSearch.length > 2 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No se encontraron recursos que coincidan.
                  </div>
                )}

                {resourceSelectorSearch.length <= 2 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Comienza a escribir para ver resultados...
                  </div>
                )}
              </>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsResourceSelectorOpen(false);
              setResourceSelectorSearch('');
            }}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Catalog Resource Dialog */}
      <Dialog open={isResourceCatalogDialogOpen} onOpenChange={setIsResourceCatalogDialogOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleSubmitCatalog(handleSaveCatalogResource)}>
            <DialogHeader>
              <DialogTitle>
                {editingCatalogResource ? 'Editar Recurso' : 'Nuevo Recurso'}
              </DialogTitle>
              <DialogDescription>
                Completa los datos del recurso para el catálogo
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="catalog-name">Nombre del Recurso</Label>
                <Input
                  id="catalog-name"
                  placeholder="Ej: Cemento Portland"
                  {...registerCatalog("nombre")}
                />
                {errorsCatalog.nombre && typeof errorsCatalog.nombre.message === 'string' && (
                  <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3 mt-1">
                    <AlertTitle className='text-sm'>Error en Recursos</AlertTitle>
                    <AlertDescription className='text-xs'>{errorsCatalog.nombre.message}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="catalog-unit">Unidad</Label>
                <Input
                  id="catalog-unit"
                  placeholder="kg, m³, hr, etc."
                  {...registerCatalog("unidad")}
                />
                {errorsCatalog.unidad && typeof errorsCatalog.unidad.message === 'string' && (
                  <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3 mt-1">
                    <AlertTitle className='text-sm'>Error en Recursos</AlertTitle>
                    <AlertDescription className='text-xs'>{errorsCatalog.unidad.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsResourceCatalogDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPostingResource || isPatchingResource} className="bg-primary text-primary-foreground">
                {editingCatalogResource ? (isPatchingResource ? 'Actualizando...' : 'Actualizar Recurso') : (isPostingResource ? 'Guardando...' : 'Guardar Recurso')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
