import { useState, Fragment } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Search, Download, ChevronDown, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { usePerformance } from '../hooks/usePerformance';

export function TablePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const {actions, loading, error}=usePerformance();
  
  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Cargando actividades...</p>
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  );
}


  const filteredActions = actions.filter(action => {
    const matchesSearch = 
      action.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.recursos.some(r => r.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || action.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleExport = () => {
    console.log('Exportando tabla de rendimientos...');
  };

  const categories = Array.from(new Set(actions.map(a => a.categoria)));

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
                <CardTitle>{actions.reduce((sum, a) => sum + a.recursos.length, 0)}</CardTitle>
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
            {/* <Button onClick={handleExport} variant="outline" className="whitespace-nowrap">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button> */}
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
                      onClick={() => action.id !== undefined && toggleRow(action.id)}
                    >
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          {action.id !== undefined && expandedRows.has(action.id) ? (
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
                    </TableRow>

                    {/* Expanded Resources */}
                    {action.id !== undefined && expandedRows.has(action.id) && (
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