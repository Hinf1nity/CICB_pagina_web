import { useState, Fragment } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Search, Download, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

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

export function TablePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Datos de ejemplo de rendimientos de construcción
  const actions: Action[] = [
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
  ];

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

  const handleExport = () => {
    // Lógica para exportar a CSV
    console.log('Exportando tabla de rendimientos...');
  };

  const categories = Array.from(new Set(actions.map(a => a.category)));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="mb-3">Tabla de Rendimientos</h1>
          <p>Consulta los rendimientos estándar de actividades de construcción</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="bg-muted py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total de Actividades</CardDescription>
                <CardTitle>{actions.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Categorías</CardDescription>
                <CardTitle>{categories.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Recursos Totales</CardDescription>
                <CardTitle>{actions.reduce((sum, a) => sum + a.resources.length, 0)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
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
              <SelectTrigger className="w-full lg:w-[250px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="outline" className="whitespace-nowrap">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
          <div className="text-muted-foreground">
            Mostrando {filteredActions.length} de {actions.length} actividades
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-card rounded-lg border border-border overflow-hidden">
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActions.map((action) => (
                  <Fragment key={action.id}>
                    {/* Main Row */}
                    <TableRow 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleRow(action.id)}
                    >
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
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
                    </TableRow>

                    {/* Expanded Resources */}
                    {expandedRows.has(action.id) && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-muted/30 p-0">
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
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="mb-2 text-foreground">Información:</h4>
          <ul className="text-muted-foreground space-y-1">
            <li>• Haz clic en una fila para expandir y ver los recursos detallados de cada actividad</li>
            <li>• Las cantidades mostradas son rendimientos estándar por unidad de medida</li>
            <li>• Los rendimientos pueden variar según las condiciones del proyecto y ubicación</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
