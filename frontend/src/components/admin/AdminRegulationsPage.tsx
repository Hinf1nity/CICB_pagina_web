import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  Download,
  ArrowLeft,
  CheckCircle2,
  Upload,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { type GenericData, genericSchema } from '../../validations/genericSchema';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useItemsAdmin, useItemPost, useItemPatch, useItemDelete, useItemDetailAdmin } from '../../hooks/useItems';

export function AdminRegulationsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GenericData | null>(null);
  const { items: regulations } = useItemsAdmin("regulation");
  const { mutate: postItem, isPending: isPosting } = useItemPost();
  const { mutate: patchItem, isPending: isPatching } = useItemPatch();
  const { mutate: deleteItem } = useItemDelete();
  const { register, handleSubmit, formState: { errors }, control, reset } = useForm<GenericData>(
    {
      resolver: zodResolver(genericSchema),
      defaultValues: {
        nombre: '',
        descripcion: '',
        fecha_publicacion: '',
        pdf: undefined,
        estado: '',
      }
    }
  );

  const handleCreate = () => {
    reset({
      nombre: '',
      descripcion: '',
      fecha_publicacion: '',
      pdf: undefined,
      estado: '',
    })
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este reglamento?')) {
      deleteItem({ id, type: "regulation" });
    }
  };

  const handleEdit = async (regulation: GenericData) => {
    const data = await useItemDetailAdmin(regulation.id!, "regulation");
    reset({
      ...regulation,
      fecha_publicacion: regulation.fecha_publicacion ? new Date(regulation.fecha_publicacion).toISOString().split('T')[0] : '',
      pdf: data?.pdf,
      pdf_url: data?.pdf_url,
    });
    setEditingItem({
      ...regulation,
      fecha_publicacion: regulation.fecha_publicacion ? new Date(regulation.fecha_publicacion).toISOString().split('T')[0] : '',
      pdf: data?.pdf,
      pdf_url: data?.pdf_url,
    });
    setIsDialogOpen(true);
  };

  const handleSave: SubmitHandler<GenericData> = (data) => {
    if (editingItem && editingItem.id !== undefined) {
      patchItem({ id: editingItem.id, data, data_old: editingItem, type: "regulation" }, {
        onSuccess: () => {
          setEditingItem(null);
          setIsDialogOpen(false);
          reset();
        }
      });
      console.log('Editando reglamento:', data);
    } else {
      console.log('Creando nuevo reglamento:', data);
      postItem({ data, type: "regulation" }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        }
      });
    }
  };

  const filteredRegulations = regulations.filter(regulation => {
    const matchesSearch = regulation.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      regulation.fecha_publicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      regulation.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vigente': return 'bg-[#3C8D50] text-white';
      case 'borrador': return 'bg-yellow-500 text-white';
      case 'archivado': return 'bg-gray-500 text-white';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'vigente': return 'Vigente';
      case 'borrador': return 'Borrador';
      case 'archivado': return 'Archivado';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Panel
          </Button>
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-10 h-10" />
            <h1 className="text-3xl font-bold mb-3">Gestión de Reglamentos</h1>
          </div>
          <p>Administra los reglamentos, normativas y documentos oficiales del CICB</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar reglamentos por título, fecha de publicación o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            className="bg-primary text-primary-foreground"
            onClick={handleCreate}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Reglamento
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit(handleSave)}>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Editar Reglamento' : 'Crear Nuevo Reglamento'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingItem
                      ? 'Actualiza la información del reglamento'
                      : 'Completa la información para crear un nuevo reglamento'}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Título</Label>
                    <Input
                      id="nombre"
                      placeholder="Título del reglamento..."
                      {...register("nombre")}
                    />
                    {errors.nombre && (
                      <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                        <AlertTitle className='text-sm'>Error en el Título</AlertTitle>
                        <AlertDescription className='text-xs'>{errors.nombre?.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      placeholder="Descripción detallada del reglamento..."
                      rows={4}
                      {...register("descripcion")}
                    />
                    {errors.descripcion && (
                      <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                        <AlertTitle className='text-sm'>Error en la Descripción</AlertTitle>
                        <AlertDescription className='text-xs'>{errors.descripcion?.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fecha_publicacion">Fecha de Publicación</Label>
                      <Input
                        id="fecha_publicacion"
                        type="date"
                        {...register("fecha_publicacion")}
                      />
                      {errors.fecha_publicacion && (
                        <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                          <AlertTitle className='text-sm'>Error en la Fecha de Publicación</AlertTitle>
                          <AlertDescription className='text-xs'>{errors.fecha_publicacion?.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Estado</Label>
                      <Controller
                        control={control}
                        name="estado"
                        render={({ field }) => (
                          <>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="borrador">Borrador</SelectItem>
                                <SelectItem value="vigente">Vigente</SelectItem>
                                <SelectItem value="archivado">Archivado</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.estado && (
                              <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                <AlertTitle className='text-sm'>Error en el Estado</AlertTitle>
                                <AlertDescription className='text-xs'>{errors.estado?.message}</AlertDescription>
                              </Alert>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>
                  <Controller
                    name="pdf"
                    control={control}
                    render={({ field }) => {
                      const file = field.value;

                      const isFile = file instanceof File;
                      const isUrl = typeof file === 'string' && file.startsWith('http');

                      const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        const newFile = e.target.files?.[0];
                        if (!newFile) return;

                        if (newFile.type !== "application/pdf") {
                          alert("Solo se permiten archivos PDF");
                          return;
                        }
                        if (newFile.size > 10 * 1024 * 1024) {
                          alert("El PDF no debe superar los 10MB");
                          return;
                        }

                        field.onChange(newFile); // ⬅️ actualiza React Hook Form
                      };

                      const removePdf = () => {
                        field.onChange(null); // limpia el valor en el form
                      };

                      return (
                        <div className="space-y-2">
                          <Label htmlFor="pdf">Documento PDF</Label>
                          {isUrl && (
                            <div className="flex items-center justify-between p-3 border border-input rounded-md bg-muted/50">
                              <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-destructive" />
                                <a href={file} target="_blank" rel="noopener noreferrer" className="text-foreground underline">
                                  Ver documento actual
                                </a>
                              </div>
                              <Button type="button" variant="ghost" size="sm" onClick={removePdf}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                          {isFile && (
                            <div className="flex items-center justify-between p-3 border border-input rounded-md bg-muted/50">
                              <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-destructive" />
                                <span className="text-foreground">{file.name}</span>
                                <span className="text-muted-foreground">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button type="button" variant="ghost" size="sm" onClick={removePdf}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                          {!isFile && !isUrl && (
                            <div className="border-2 border-dashed border-input rounded-md p-4 text-center hover:border-primary transition-colors">
                              <input
                                type="file"
                                id="pdf"
                                accept=".pdf"
                                onChange={handlePdfChange}
                                className="hidden"
                              />
                              <label htmlFor="pdf" className="cursor-pointer">
                                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                  Sube un PDF con detalles adicionales (máx. 10MB)
                                </p>
                              </label>
                            </div>
                          )}
                          {errors.pdf && (
                            <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                              <AlertTitle className='text-sm'>Error en el PDF</AlertTitle>
                              <AlertDescription className='text-xs'>{errors.pdf?.message}</AlertDescription>
                            </Alert>
                          )}
                        </div>
                      );
                    }}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type='submit' disabled={isPosting || isPatching} className="bg-primary text-primary-foreground">
                    {editingItem ? (isPatching ? 'Actualizando...' : 'Actualizar Reglamento') : (isPosting ? 'Guardando...' : 'Guardar Reglamento')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Total Reglamentos</p>
                  <p className="text-3xl">{regulations.length}</p>
                </div>
                <FileText className="w-8 h-8 text-[#0B3D2E]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Vigentes</p>
                  <p className="text-3xl">
                    {regulations.filter(r => r.estado === 'vigente').length}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-[#3C8D50]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Borradores</p>
                  <p className="text-3xl">
                    {regulations.filter(r => r.estado === 'borrador').length}
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
                  <p className="text-muted-foreground mb-1">Archivados</p>
                  <p className="text-3xl">
                    {regulations.filter(r => r.estado === 'archivado').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regulations List */}
        <Card>
          <CardHeader>
            <CardTitle>Reglamentos Registrados</CardTitle>
            <CardDescription>
              {filteredRegulations.length} reglamento(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRegulations.map((regulation) => (
                <div
                  key={regulation.id}
                  className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-foreground">{regulation.nombre}</h3>
                        <Badge className={getStatusColor(regulation.estado)}>
                          {getStatusLabel(regulation.estado)}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-3">{regulation.descripcion}</p>

                      <div className="flex flex-wrap gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Publicación: {new Date(regulation.fecha_publicacion).toLocaleDateString('es-BO')}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {regulation.pdf_url && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          PDF
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(regulation)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => regulation.id !== undefined && handleDelete(regulation.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredRegulations.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No se encontraron reglamentos</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}