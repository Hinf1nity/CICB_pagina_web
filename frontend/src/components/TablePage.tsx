import { useState, Fragment, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Search, FileText, X, ChevronDown, ChevronRight, CheckSquare, Square } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { usePerformance, useDownloadPDF } from '../hooks/usePerformance';
import type { Recurso } from '../validations/performanceSchema';
import { useDebounce } from 'use-debounce';

export function TablePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  useEffect(() => {
    setPage(1); // Reset to first page on new search
  }, [debouncedSearchTerm, filterCategory]);

  const { actions, loading, error, count, next, previous, total_categories, total_resources } = usePerformance(page, debouncedSearchTerm, filterCategory);
  const pageSize = 20;
  const totalPages = count ? Math.ceil(count / pageSize) : 1;
  const { mutate, isPending } = useDownloadPDF();
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

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const toggleSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (actions.every(a => selectedIds.has(a.id!))) {
      const next = new Set(selectedIds);
      actions.forEach(a => next.delete(a.id!));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      actions.forEach(a => next.add(a.id!));
      setSelectedIds(next);
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  }

  const categories = Array.from(new Set(actions.map(a => a.categoria)));
  const allFilteredSelected = actions.length > 0 && actions.every(a => a.id !== undefined && selectedIds.has(a.id));
  const someFilteredSelected = actions.some(a => a.id !== undefined && selectedIds.has(a.id)) && !allFilteredSelected;

  const generatePDF = () => {
    if (selectedIds.size === 0) {
      alert("Selecciona al menos una actividad");
      return;
    }
    // Aquí iría la lógica para generar el PDF con los datos de selectedActions
    console.log('Generando PDF para las actividades con IDs:', Array.from(selectedIds));
    mutate(Array.from(selectedIds));
  }

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
                <CardTitle>{count}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Categorías</CardDescription>
                <CardTitle>{total_categories}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Recursos Totales</CardDescription>
                <CardTitle>{total_resources}</CardTitle>
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
          </div>
          <div className="text-muted-foreground">
            Mostrando {1 + (page - 1) * pageSize}-{Math.min(page * pageSize, count)} de {count} actividades
          </div>
        </div>
      </div>

      {/* Sticky Selection Panel */}
      {selectedIds.size > 0 && (
        <div className="sticky top-0 z-50 bg-white border-b-2 border-[#1B5E3A] shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#0B3D2E] text-white shrink-0">
                <span className="text-sm">{selectedIds.size}</span>
              </div>
              <div>
                <p className="text-[#0B3D2E]">
                  {selectedIds.size === 1
                    ? '1 actividad seleccionada'
                    : `${selectedIds.size} actividades seleccionadas`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
                className="text-muted-foreground border-muted-foreground/40"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Limpiar
              </Button>
              <Button
                size="sm"
                onClick={generatePDF}
                disabled={isPending}
                className="bg-[#0B3D2E] hover:bg-[#1B5E3A] text-white gap-2"
              >
                <FileText className="w-4 h-4" />
                {isPending ? "Generando PDF..." : "Generar PDF"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <div className="bg-card rounded-lg border border-border overflow-hidden">

          {/* ── Mobile card list (hidden on md+) ── */}
          <div className="md:hidden">
            {actions.map((action) => {
              const isSelected = selectedIds.has(action.id!);
              const isExpanded = expandedRows.has(action.id!);
              const materiales = action.recursos_agrupados.Materiales?.length > 0
                ? action.recursos_agrupados.Materiales.map(r => ({
                  ...r,
                  cantidad: Number(r.cantidad),
                  recurso: typeof r.recurso === 'object' ? { ...r.recurso, id: r.recurso.id ?? 0, categoria: r.recurso.categoria ?? '' } : r.recurso
                }))
                : [];
              const manoObra = action.recursos_agrupados['Mano de Obra']?.length > 0
                ? action.recursos_agrupados['Mano de Obra'].map(r => ({
                  ...r,
                  cantidad: Number(r.cantidad),
                  recurso: typeof r.recurso === 'object' ? { ...r.recurso, id: r.recurso.id ?? 0, categoria: r.recurso.categoria ?? '' } : r.recurso
                }))
                : [];
              const herramientas = action.recursos_agrupados['Herramientas y Equipo']?.length > 0
                ? action.recursos_agrupados['Herramientas y Equipo'].map(r => ({
                  ...r,
                  cantidad: Number(r.cantidad),
                  recurso: typeof r.recurso === 'object' ? { ...r.recurso, id: r.recurso.id ?? 0, categoria: r.recurso.categoria ?? '' } : r.recurso
                }))
                : [];

              const MobileSubTable = ({
                title, items, accentClass, badgeClass,
              }: {
                title: string; items: {
                  id?: number;
                  recurso: string | Recurso;
                  cantidad: number;
                }[]; accentClass: string; badgeClass: string;
              }) =>
                items.length > 0 ? (
                  <div className="mb-3 last:mb-0">
                    <div className={`px-3 py-1 rounded-t-md text-xs ${accentClass}`}>{title}</div>
                    <div className="border border-border rounded-b-md overflow-hidden">
                      <table className="w-full text-sm table-fixed">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="text-left py-1.5 px-2 text-muted-foreground text-xs">Recurso</th>
                            <th className="text-center py-1.5 px-2 text-muted-foreground text-xs w-16">Unid.</th>
                            <th className="text-right py-1.5 px-2 text-muted-foreground text-xs w-16">Cant.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((r, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                              <td className="py-1.5 px-2 min-w-0" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal' }}>{r.recurso instanceof Object ? r.recurso.nombre : r.recurso}</td>
                              <td className="py-1.5 px-2 text-center">
                                <span className={`inline-block px-1.5 py-0.5 rounded text-xs ${badgeClass}`}>{r.recurso instanceof Object ? r.recurso.unidad : ''}</span>
                              </td>
                              <td className="py-1.5 px-2 text-right tabular-nums">{r.cantidad}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null;

              return (
                <div
                  key={action.id}
                  className={`border-b border-border last:border-0 transition-colors ${isSelected ? 'bg-[#0B3D2E]/5' : ''}`}
                >
                  {/* Card header row */}
                  <div className="flex items-start gap-2 p-3">
                    {/* Checkbox */}
                    <div
                      className="pt-0.5 shrink-0"
                      onClick={(e) => toggleSelect(action.id!, e)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => {
                          const next = new Set(selectedIds);
                          if (next.has(action.id!)) next.delete(action.id!);
                          else next.add(action.id!);
                          setSelectedIds(next);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="border-[#1B5E3A] data-[state=checked]:bg-[#1B5E3A] data-[state=checked]:border-[#1B5E3A]"
                      />
                    </div>

                    {/* Main content */}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => toggleRow(action.id!)}
                    >
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <code className="text-primary text-xs">{action.codigo}</code>
                        <Badge variant="outline" className="text-xs py-0">{action.unidad}</Badge>
                        <Badge className="bg-secondary text-secondary-foreground text-xs py-0">{action.categoria}</Badge>
                      </div>
                      <p className={`text-sm leading-snug ${isSelected ? 'text-[#0B3D2E]' : ''}`}>{action.actividad}</p>
                      <p className="text-xs text-muted-foreground mt-1">{action.recursos_info.length} recursos</p>
                    </div>

                    {/* Expand toggle */}
                    <button
                      className="shrink-0 p-1 rounded hover:bg-muted"
                      onClick={() => toggleRow(action.id!)}
                    >
                      {isExpanded
                        ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </div>

                  {/* Expanded resources */}
                  {isExpanded && (
                    <div className="px-3 pb-4 border-t border-border bg-muted/20">
                      <p className="text-xs text-muted-foreground mt-3 mb-3 uppercase tracking-wide">
                        Recursos por unidad ({action.unidad})
                      </p>
                      <div className="space-y-3">
                        <MobileSubTable title="Material" items={materiales} accentClass="bg-[#1B5E3A] text-white" badgeClass="bg-[#1B5E3A]/10 text-[#1B5E3A]" />
                        <MobileSubTable title="Mano de Obra" items={manoObra} accentClass="bg-[#3A5A78] text-white" badgeClass="bg-[#3A5A78]/10 text-[#3A5A78]" />
                        <MobileSubTable title="Herramientas y Equipo" items={herramientas} accentClass="bg-amber-700 text-white" badgeClass="bg-amber-100 text-amber-800" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {count === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron actividades que coincidan con tu búsqueda.</p>
              </div>
            )}
          </div>

          {/* -- Desktop Table -- */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <div
                      className="flex items-center justify-center cursor-pointer"
                      onClick={toggleSelectAll}
                      title={allFilteredSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
                    >
                      {allFilteredSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#1B5E3A]" />
                      ) : someFilteredSelected ? (
                        <div className="w-4 h-4 border-2 border-[#1B5E3A] rounded-sm flex items-center justify-center">
                          <div className="w-2 h-0.5 bg-[#1B5E3A]" />
                        </div>
                      ) : (
                        <Square className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="w-32">Código</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="w-24">Unidad</TableHead>
                  <TableHead className="w-48">Categoría</TableHead>
                  <TableHead className="w-28 text-center">Recursos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions.map((action) => {
                  const isSelected = action.id !== undefined && selectedIds.has(action.id);
                  const isExpanded = action.id !== undefined && expandedRows.has(action.id);
                  return (
                    <Fragment key={action.id}>
                      {/* Main Row */}
                      <TableRow
                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-[#0B3D2E]/5 hover:bg-[#0B3D2E]/10' : 'hover:bg-muted/50'}`}
                        onClick={() => action.id !== undefined && toggleRow(action.id)}
                      >
                        <TableCell onClick={(e) => toggleSelect(action.id!, e)} className='cursor-pointer'>
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => {
                                const next = new Set(selectedIds);
                                if (next.has(action.id!)) next.delete(action.id!);
                                else next.add(action.id!);
                                setSelectedIds(next);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="border-[#1B5E3A] data-[state=checked]:bg-[#1B5E3A] data-[state=checked]:border-[#1B5E3A]"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <code className="text-primary">{action.codigo}</code>
                        </TableCell>
                        <TableCell className={`lowercase first-letter:uppercase ${isSelected ? 'text-[#0B3D2E]' : ''}`}>{action.actividad}</TableCell>
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
                      </TableRow>

                      {/* Expanded Resources */}
                      {isExpanded && (() => {
                        const materiales = action.recursos_agrupados.Materiales?.length > 0
                          ? action.recursos_agrupados.Materiales.map(r => ({
                            ...r,
                            cantidad: Number(r.cantidad),
                            recurso: typeof r.recurso === 'object' ? { ...r.recurso, id: r.recurso.id ?? 0, categoria: r.recurso.categoria ?? '' } : r.recurso
                          }))
                          : [];
                        const manoObra = action.recursos_agrupados['Mano de Obra']?.length > 0
                          ? action.recursos_agrupados['Mano de Obra'].map(r => ({
                            ...r,
                            cantidad: Number(r.cantidad),
                            recurso: typeof r.recurso === 'object' ? { ...r.recurso, id: r.recurso.id ?? 0, categoria: r.recurso.categoria ?? '' } : r.recurso
                          }))
                          : [];
                        const herramientas = action.recursos_agrupados['Herramientas y Equipo']?.length > 0
                          ? action.recursos_agrupados['Herramientas y Equipo'].map(r => ({
                            ...r,
                            cantidad: Number(r.cantidad),
                            recurso: typeof r.recurso === 'object' ? { ...r.recurso, id: r.recurso.id ?? 0, categoria: r.recurso.categoria ?? '' } : r.recurso
                          }))
                          : [];

                        const ResourceSubTable = ({
                          title,
                          items,
                          accentClass,
                          badgeClass,
                        }: {
                          title: string;
                          items: {
                            id?: number;
                            recurso: string | { id: number; nombre: string; unidad: string; categoria: string };
                            cantidad: number;
                          }[];
                          accentClass: string;
                          badgeClass: string;
                        }) =>
                          items.length > 0 ? (
                            <div className="mb-4 last:mb-0">
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-t-md ${accentClass}`}>
                                <span className="text-xs">{title}</span>
                              </div>
                              <div className="rounded-b-md rounded-tr-md border border-border overflow-hidden">
                                <table className="w-full text-sm table-fixed">
                                  <thead>
                                    <tr className="bg-muted/50 border-b border-border">
                                      <th className="text-left py-2 px-3 text-muted-foreground text-xs">Recurso</th>
                                      <th className="text-center py-2 px-3 text-muted-foreground text-xs w-20">Unidad</th>
                                      <th className="text-right py-2 px-3 text-muted-foreground text-xs w-24">Cantidad</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {items.map((r, i) => (
                                      <tr key={i} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                                        <td className="py-2 px-3 lowercase first-letter:uppercase" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal' }}>{typeof r.recurso === 'object' ? r.recurso.nombre : r.recurso}</td>
                                        <td className="py-2 px-3 text-center">
                                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${badgeClass}`}>{typeof r.recurso === 'object' ? r.recurso.unidad : ''}</span>
                                        </td>
                                        <td className="py-2 px-3 text-right tabular-nums">{r.cantidad}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : null;
                        return (
                          <TableRow>
                            <TableCell colSpan={7} className="bg-muted/20 p-0">
                              <div className="px-4 md:px-8 lg:px-6 py-5 border-l-4 border-l-[#3C8D50] ml-0 md:ml-4 lg:ml-8">
                                <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wide">
                                  Recursos necesarios por unidad ({action.unidad})
                                </p>
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                  <ResourceSubTable
                                    title="Material"
                                    items={materiales}
                                    accentClass="bg-[#1B5E3A] text-white"
                                    badgeClass="bg-[#1B5E3A]/10 text-[#1B5E3A]"
                                  />
                                  <ResourceSubTable
                                    title="Mano de Obra"
                                    items={manoObra}
                                    accentClass="bg-[#3A5A78] text-white"
                                    badgeClass="bg-[#3A5A78]/10 text-[#3A5A78]"
                                  />
                                  <ResourceSubTable
                                    title="Herramientas y Equipo"
                                    items={herramientas}
                                    accentClass="bg-amber-700 text-white"
                                    badgeClass="bg-amber-100 text-amber-800"
                                  />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })()}
                    </Fragment>
                  )
                }
                )}
              </TableBody>
            </Table>
          </div>

          {count === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron actividades que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
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

        {/* Legend */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="mb-3 text-foreground">Instrucciones de uso:</h4>
          <ul className="text-muted-foreground space-y-1.5 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#1B5E3A] mt-0.5">①</span>
              <span>Marca las casillas de las actividades que deseas incluir en el PDF — puedes seleccionar cuantas necesites.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1B5E3A] mt-0.5">②</span>
              <span>Haz clic en el icono de la primera columna del encabezado para marcar/desmarcar todas las actividades visibles.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1B5E3A] mt-0.5">③</span>
              <span>Una vez que termines de seleccionar, pulsa <strong>"Generar PDF"</strong> en el panel superior para abrir la vista de impresión.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground mt-0.5">•</span>
              <span>Haz clic en cualquier fila para expandir y ver los recursos detallados (Material, Mano de Obra, Herramientas y Equipo).</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}