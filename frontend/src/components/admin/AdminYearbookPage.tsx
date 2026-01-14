import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { BookOpen, Plus, Edit, Trash2, Search, Calendar, Download, ArrowLeft, Upload, X, Eye, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../ui/select';

import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { type GenericData, genericSchema } from '../../validations/genericSchema';
import { useItemsAdmin, useItemPost, useItemPatch, useItemDelete } from '../../hooks/useItems';
import { Alert, AlertDescription } from '../ui/alert';

export function AdminYearbookPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GenericData | null>(null);

  const { items: yearbooks, refetchItems, loading } = useItemsAdmin("yearbooks");
  console.log("Yearbooks loaded:", yearbooks);
  const { postItem } = useItemPost();
  const { patchItem } = useItemPatch();
  const { deleteItem } = useItemDelete();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<GenericData>({
    resolver: zodResolver(genericSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      fecha_publicacion: new Date().toISOString().split('T')[0],
      pdf: undefined,
      estado: 'borrador',
    }
  });

  const handleCreate = () => {
    reset({
      nombre: '',
      descripcion: '',
      fecha_publicacion: new Date().toISOString().split('T')[0],
      pdf: undefined,
      estado: 'borrador'
    });
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: GenericData) => {
    reset({
      ...item,
      fecha_publicacion: item.fecha_publicacion ? new Date(item.fecha_publicacion).toISOString().split('T')[0] : '',
    });
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este anuario?')) {
      await deleteItem(id, "yearbooks");
      refetchItems();
    }
  };

  const handleSave: SubmitHandler<GenericData> = async (data) => {
    try {
      if (editingItem?.id) {
        await patchItem(editingItem.id, data, editingItem, "yearbooks");
      } else {
        await postItem(data, "yearbooks");
      }
      refetchItems();
      setIsDialogOpen(false);
      reset();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const filteredYearbooks = yearbooks.filter((y) =>
    y.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    y.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'publicado':
        return 'bg-[#3C8D50] text-white';
      case 'borrador':
        return 'bg-orange-500 text-white';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Corporativo */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-4 text-primary-foreground hover:bg-white/10"
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Panel
          </Button>
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-10 h-10" />
            <h1 className="text-3xl font-bold">Gestión de Anuarios</h1>
          </div>
          <p className="text-primary-foreground/80">Administra los anuarios anuales del Colegio de Ingenieros Civiles de Bolivia</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Barra de Búsqueda y Acción */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar anuarios por año o título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" /> Nuevo Anuario
          </Button>
        </div>

        {/* Panel de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Anuarios</p>
                  <p className="text-3xl font-bold">{yearbooks.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Publicados</p>
                  <p className="text-3xl font-bold">
                    {yearbooks.filter(y => y.estado === 'publicado').length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-[#3C8D50]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Borradores</p>
                  <p className="text-3xl font-bold">
                    {yearbooks.filter(y => y.estado === 'borrador').length}
                  </p>
                </div>
                <Edit className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Año Actual</p>
                  <p className="text-3xl font-bold">{new Date().getFullYear()}</p>
                </div>
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal de Formulario */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit(handleSave)}>
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Editar Anuario' : 'Crear Nuevo Anuario'}</DialogTitle>
                <DialogDescription>
                  Completa la información oficial para el anuario del CICB.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Título</Label>
                  <Input
                    id="nombre"
                    {...register("nombre")}
                    placeholder="Ej: Anuario CICB 2024"
                    autoComplete="off"
                  />
                  {errors.nombre && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription className="text-xs">{errors.nombre.message}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    {...register("descripcion")}
                    placeholder="Resumen del contenido del anuario..."
                    rows={4}
                  />
                  {errors.descripcion && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription className="text-xs">{errors.descripcion.message}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha_publicacion">Fecha de Publicación</Label>
                    <Input id="fecha_publicacion" type="date" {...register("fecha_publicacion")} />
                  </div>

                  <div className="space-y-2">
                    <Label>Estado de Publicación</Label>
                    <Controller
                      control={control}
                      name="estado"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="borrador">Borrador</SelectItem>
                            <SelectItem value="publicado">Publicado</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <Controller
                  name="pdf"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label>Documento PDF (Anuario)</Label>
                      {field.value instanceof File ? (
                        <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-[#063228]" />
                            <span className="text-sm font-medium">{field.value.name}</span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => field.onChange(null)}><X className="w-4 h-4 text-red-500" /></Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors bg-muted/50">
                          <input type="file" id="pdf-upload" accept=".pdf" className="hidden" onChange={(e) => field.onChange(e.target.files?.[0])} />
                          <label htmlFor="pdf-upload" className="cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium">Click para subir el archivo PDF</p>
                            <p className="text-xs text-muted-foreground mt-1">Tamaño máximo recomendado: 10MB</p>
                          </label>
                        </div>
                      )}
                      {errors.pdf && <p className="text-red-500 text-xs mt-1">{errors.pdf.message}</p>}
                    </div>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="submit">
                  {editingItem ? 'Actualizar' : 'Crear'} Anuario
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Lista de Anuarios */}
        <Card className="shadow-md">
          <CardHeader className="border-b">
            <CardTitle>Anuarios Registrados</CardTitle>
            <CardDescription>{filteredYearbooks.length} anuario(s) encontrado(s)</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {filteredYearbooks.map((yearbook) => (
              <div key={yearbook.id} className="border border-border rounded-lg p-5 flex justify-between items-center gap-4 hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-foreground">{yearbook.nombre}</h3>
                    <Badge className={getStatusColor(yearbook.estado)}>
                      {yearbook.estado === 'publicado' ? 'Publicado' : 'Borrador'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 max-w-4xl">{yearbook.descripcion}</p>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Publicado: {yearbook.fecha_publicacion ? new Date(yearbook.fecha_publicacion).toLocaleDateString('es-BO') : 'Sin fecha'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {yearbook.pdf_url && (
                    <Button variant="outline" size="sm" onClick={() => window.open(yearbook.pdf_url as string, '_blank')}>
                      <Download className="w-4 h-4 mr-2" /> PDF
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleEdit(yearbook)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => yearbook.id && handleDelete(yearbook.id)}
                    className="text-red-500 hover:bg-red-50 border-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {!loading && filteredYearbooks.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-slate-400">No se encontraron anuarios en la base de datos</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}