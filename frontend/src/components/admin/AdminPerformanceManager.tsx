import { useState, Fragment } from 'react';
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
import { type PerformanceData, type Recurso, performanceSchema } from '../../validations/performanceSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { usePerformance, usePerformancePost, usePerformancePatch, usePerformanceDelete, searchResourceByName, useResources } from '../../hooks/usePerformance';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface CatalogResource {
  id: number;
  nombre: string;
  unidad: string;
}


export function AdminPerformanceManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<PerformanceData | null>(null);
  const [resources, setResources] = useState<Recurso[]>([]);
  const [catalogSearchTerm, setCatalogSearchTerm] = useState('');
  const [isResourceCatalogDialogOpen, setIsResourceCatalogDialogOpen] = useState(false);
  const [editingCatalogResource, setEditingCatalogResource] = useState<CatalogResource | null>(null);
  const [isResourceSelectorOpen, setIsResourceSelectorOpen] = useState(false);
  const [resourceSelectorSearch, setResourceSelectorSearch] = useState('');
  const { actions, refetch } = usePerformance();
  const { postPerformance } = usePerformancePost();
  const { patchPerformance } = usePerformancePatch();
  const { deletePerformance } = usePerformanceDelete();
  const { resources: searchedResources } = searchResourceByName(resourceSelectorSearch);
  const { resources: resourceCatalog } = useResources();
  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<PerformanceData>({
    resolver: zodResolver(performanceSchema),
    defaultValues: {
      codigo: '',
      actividad: '',
      unidad: '',
      categoria: '',
      recursos_info: [],
    },
  });
  // const [resourceCatalog, setResourceCatalog] = useState<Recurso[]>([
  //   // Materiales de Construcción
  //   { id: 1, nombre: 'Cemento Portland', unidad: 'kg' },
  //   { id: 2, nombre: 'Cemento cola', unidad: 'kg' },
  //   { id: 3, nombre: 'Arena', unidad: 'm3' },
  //   { id: 4, nombre: 'Grava', unidad: 'm3' },
  //   { id: 5, nombre: 'Agua', unidad: 'lt' },
  //   { id: 6, nombre: 'Ladrillo gambote', unidad: 'pza' },
  //   { id: 7, nombre: 'Fierro corrugado', unidad: 'kg' },
  //   { id: 8, nombre: 'Alambre de amarre', unidad: 'kg' },
  //   { id: 9, nombre: 'Madera de encofrado', unidad: 'p²' },
  //   { id: 10, nombre: 'Clavos', unidad: 'kg' },
  //   { id: 11, nombre: 'Yeso', unidad: 'kg' },
  //   { id: 12, nombre: 'Calamina galvanizada #28', unidad: 'm²' },
  //   { id: 13, nombre: 'Cumbrera galvanizada', unidad: 'm' },
  //   { id: 14, nombre: 'Pintura látex', unidad: 'lt' },
  //   { id: 15, nombre: 'Sellador', unidad: 'lt' },
  //   { id: 16, nombre: 'Lija', unidad: 'plg' },
  //   { id: 17, nombre: 'Cerámica 40x40', unidad: 'm²' },
  //   { id: 18, nombre: 'Fragua', unidad: 'kg' },
  //   { id: 19, nombre: 'Tubo PVC 1/2"', unidad: 'm' },
  //   { id: 20, nombre: 'Codos PVC 1/2"', unidad: 'pza' },
  //   { id: 21, nombre: 'Tees PVC 1/2"', unidad: 'pza' },
  //   { id: 22, nombre: 'Pegamento PVC', unidad: 'lt' },
  //   { id: 23, nombre: 'Cinta teflón', unidad: 'rollo' },
  //   { id: 24, nombre: 'Madera mara', unidad: 'p²' },
  //   { id: 25, nombre: 'Triplay 4mm', unidad: 'plg' },
  //   { id: 26, nombre: 'Cola carpintero', unidad: 'kg' },
  //   { id: 27, nombre: 'Laca', unidad: 'lt' },
  //   { id: 28, nombre: 'Cable THW #14', unidad: 'm' },
  //   { id: 29, nombre: 'Tubo PVC eléctrico 3/4"', unidad: 'm' },
  //   { id: 30, nombre: 'Caja octogonal', unidad: 'pza' },
  //   { id: 31, nombre: 'Interruptor simple', unidad: 'pza' },
  //   { id: 32, nombre: 'Cinta aislante', unidad: 'rollo' },
  //   { id: 33, nombre: 'Clavos para calamina', unidad: 'pza' },
  //   { id: 34, nombre: 'Tijerales de madera', unidad: 'pza' },

  //   // Mano de Obra
  //   { id: 35, nombre: 'Albañil', unidad: 'hr' },
  //   { id: 36, nombre: 'Albañil especializado', unidad: 'hr' },
  //   { id: 37, nombre: 'Ayudante', unidad: 'hr' },
  //   { id: 38, nombre: 'Yesero', unidad: 'hr' },
  //   { id: 39, nombre: 'Techador', unidad: 'hr' },
  //   { id: 40, nombre: 'Pintor', unidad: 'hr' },
  //   { id: 41, nombre: 'Peón', unidad: 'hr' },
  //   { id: 42, nombre: 'Ceramista', unidad: 'hr' },
  //   { id: 43, nombre: 'Plomero', unidad: 'hr' },
  //   { id: 44, nombre: 'Carpintero', unidad: 'hr' },
  //   { id: 45, nombre: 'Electricista', unidad: 'hr' },

  //   // Herramientas y Equipos
  //   { id: 46, nombre: 'Pala', unidad: 'hr' },
  //   { id: 47, nombre: 'Picota', unidad: 'hr' },
  //   { id: 48, nombre: 'Mezcladora', unidad: 'hr' },
  //   { id: 49, nombre: 'Vibrador', unidad: 'hr' },
  //   { id: 50, nombre: 'Andamio', unidad: 'día' },
  // ]);

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
      action.actividad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.recursos_info.some(r => typeof r.recurso === 'object' && r.recurso !== null && r.recurso.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || action.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredCatalog = resourceCatalog.filter(resource => {
    const matchesSearch = resource.nombre.toLowerCase().includes(catalogSearchTerm.toLowerCase());
    return matchesSearch;
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
    setEditingAction(action);
    // setResources([...action.recursos_info.map(ri => typeof ri.recurso === 'object' ? {
    //   id: ri.recurso.id,
    //   nombre: ri.recurso.nombre,
    //   unidad: ri.recurso.unidad,
    //   cantidad: ri.cantidad,
    // } : {
    //   id: ri.recurso,
    //   nombre: '',
    //   unidad: '',
    //   cantidad: ri.cantidad,
    // })]);
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
        await patchPerformance(editingAction.id.toString(), data);
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

  const handleRemoveResource = (id: string) => {
    setResources(resources.filter(r => r.id?.toString() !== id));
  };

  const handleCreateCatalogResource = () => {
    setEditingCatalogResource(null);
    setIsResourceCatalogDialogOpen(true);
  };

  const handleEditCatalogResource = (resource: CatalogResource) => {
    setEditingCatalogResource(resource);
    setIsResourceCatalogDialogOpen(true);
  };

  const handleDeleteCatalogResource = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este recurso del catálogo?')) {
      // setResourceCatalog(resourceCatalog.filter(r => r.id?.toString() !== id));
      console.log("Eliminar recurso del catálogo:", id);
    }
  };

  const handleSaveCatalogResource = () => {
    setIsResourceCatalogDialogOpen(false);
    // Lógica para guardar recurso al catálogo
  };

  const categories = Array.from(new Set((actions || []).map(a => a.categoria)));

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
            </div>

            {filteredActions.length === 0 && (
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
              <Button onClick={handleCreateCatalogResource} className="bg-primary text-primary-foreground">
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
              Mostrando {filteredCatalog.length} de {resourceCatalog.length} recursos
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
                  {filteredCatalog.map((resource) => (
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
            </div>

            {filteredCatalog.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron recursos que coincidan con tu búsqueda.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

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
                      <input type="hidden" value={resource.id}{...register(`recursos_info.${index}.recurso`)} />
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
                          onClick={() => handleRemoveResource(resource.id!.toString())}
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
              <Button type='submit' className="bg-primary text-primary-foreground">
                Guardar
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
                  .map((resource) => (
                    <button
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
                defaultValue={editingCatalogResource?.nombre}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="catalog-unit">Unidad</Label>
              <Input
                id="catalog-unit"
                placeholder="kg, m³, hr, etc."
                defaultValue={editingCatalogResource?.unidad}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResourceCatalogDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCatalogResource} className="bg-primary text-primary-foreground">
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
