import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Megaphone, Plus, Edit, Trash2, Search, Calendar, Download, ArrowLeft, Upload, X, Eye,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { type GenericData, genericSchema } from '../../validations/genericSchema';
import { useItemsAdmin, useItemPost, useItemPatch, useItemDelete, useItemDetailAdmin } from '../../hooks/useItems';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useDebounce } from 'use-debounce';

export function AdminAnnouncementsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GenericData | null>(null);
  const [page, setPage] = useState(1);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);
  const { items: announcements, count, published_count, draft_count, archived_count, next, previous } = useItemsAdmin("announcements", page, debouncedSearchTerm);
  const pageSize = 20;
  const totalPages = count ? Math.ceil(count / pageSize) : 1;
  const { mutate: postItem, isPending: isPosting } = useItemPost();
  const { mutate: patchItem, isPending: isPatching } = useItemPatch();
  const { mutate: deleteItem } = useItemDelete();

  const stats = {
    total: count,
    activas: published_count,
    borradores: draft_count,
    cerradas: archived_count,
  };

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
    reset({ nombre: '', descripcion: '', fecha_publicacion: new Date().toISOString().split('T')[0], pdf: undefined, estado: 'borrador' });
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = async (item: GenericData) => {
    const data = await useItemDetailAdmin(item.id!, "announcements");
    reset({
      ...item,
      fecha_publicacion: item.fecha_publicacion ? new Date(item.fecha_publicacion).toISOString().split('T')[0] : '',
      pdf: data?.pdf,
      pdf_url: data?.pdf_url,
    });
    setEditingItem({
      ...item,
      fecha_publicacion: item.fecha_publicacion ? new Date(item.fecha_publicacion).toISOString().split('T')[0] : '',
      pdf: data?.pdf,
      pdf_url: data?.pdf_url,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
      deleteItem({ id, type: "announcements" });
    }
  };

  const handleSave: SubmitHandler<GenericData> = (data) => {
    if (editingItem?.id) {
      patchItem({ id: editingItem.id, data, data_old: editingItem, type: "announcements" }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setEditingItem(null);
          reset();
        }
      });
    } else {
      postItem({ data, type: "announcements" }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-[#003D33] text-white pt-6 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-sm mb-6 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Panel
          </button>

          <div className="flex items-start gap-4">
            <Megaphone className="w-10 h-10 mt-1" />
            <div>
              <h1 className="text-2xl font-bold">Gestión de Convocatorias</h1>
              <p className="text-gray-300 text-sm mt-1">Administra convocatorias, licitaciones y llamados oficiales del CICB</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar convocatorias por título o fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleCreate}
          >
            <Plus className="w-4 h-4 mr-2" /> Nueva Convocatoria
          </Button>
        </div>

        {/* 2. Tarjetas de Estadísticas DEBAJO */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total" value={stats.total} icon={<Megaphone className="w-8 h-8 text-primary" />} />
          <StatCard title="Activas" value={stats.activas} icon={<Eye className="w-8 h-8 text-green-600" />} />
          <StatCard title="Borradores" value={stats.borradores} icon={<Edit className="w-8 h-8 text-yellow-500" />} />
          <StatCard title="Cerradas" value={stats.cerradas} icon={<Calendar className="w-8 h-8 text-gray-500" />} />
        </div>

        {/* 3. Listado de Convocatorias */}
        <Card>
          <CardHeader>
            <CardTitle>Convocatorias Registradas</CardTitle>
            <CardDescription>
              Mostrando {1 + (page - 1) * pageSize}-{Math.min(page * pageSize, count)} de {count} convocatorias
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow flex items-start justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-foreground text-base font-medium">
                        {item.nombre}
                      </h3>

                      {item.estado === 'activa' && (
                        <Badge className="bg-green-600 text-white hover:bg-green-700 border-none px-3">
                          Activa
                        </Badge>
                      )}
                      {item.estado === 'borrador' && (
                        <Badge className="bg-yellow-500 text-white hover:bg-yellow-600 border-none px-3">
                          Borrador
                        </Badge>
                      )}
                      {item.estado === 'cerrada' && (
                        <Badge className="bg-gray-500 text-white hover:bg-gray-600 border-none px-3">
                          Cerrada
                        </Badge>
                      )}
                    </div>

                    <p className="text-muted-foreground mb-3">
                      {item.descripcion}
                    </p>

                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Fecha de Publicación: {new Date(item.fecha_publicacion).toLocaleDateString('es-BO')}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {item.pdf_url && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          window.open(item.pdf_url as string, '_blank')
                        }
                        className="border-gray-200"
                      >
                        <Download className="w-4 h-4 text-gray-500" />
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(item)}
                      className="border-gray-200"
                    >
                      <Edit className="w-4 h-4 text-gray-500" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => item.id && handleDelete(item.id)}
                      className="border-gray-200 hover:bg-red-50 hover:border-red-200"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo de Creación/Edición */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-[#003D33] text-xl font-bold">
                {editingItem ? 'Editar Convocatoria' : 'Crear Nueva Convocatoria'}
              </DialogTitle>
              <DialogDescription>Completa la información para la nueva publicación</DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nombre">Título</Label>
                <Input
                  id="nombre"
                  {...register("nombre")}
                  placeholder="Título de la convocatoria..."
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
                  {...register("descripcion")}
                  placeholder="Descripción detallada..."
                  rows={4}
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
                  <Label htmlFor="fecha_publicacion" >Fecha de Publicación</Label>
                  <Input id="fecha_publicacion" type="date" {...register("fecha_publicacion")} disabled />
                  {errors.fecha_publicacion && (
                    <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                      <AlertTitle className='text-sm'>Error en la Fecha de Publicación</AlertTitle>
                      <AlertDescription className='text-xs'>{errors.fecha_publicacion?.message}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Controller
                    control={control}
                    name="estado"
                    render={({ field }) => (
                      <>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="borrador">Borrador</SelectItem>
                            <SelectItem value="activa">Activa</SelectItem>
                            <SelectItem value="cerrada">Cerrada</SelectItem>
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
                  return (
                    <div className="space-y-2">
                      <Label>Documento PDF (Reglamento)</Label>
                      {isUrl && (
                        <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-[#063228]" />
                            <a href={file} target="_blank" rel="noopener noreferrer" className="text-sm font-medium underline">
                              Ver PDF Actual
                            </a>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => field.onChange(null)}><X className="w-4 h-4 text-red-500" /></Button>
                        </div>
                      )}
                      {isFile && (
                        <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-[#063228]" />
                            <span className="text-sm font-medium">{file.name}</span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => field.onChange(null)}><X className="w-4 h-4 text-red-500" /></Button>
                        </div>
                      )}
                      {!isFile && !isUrl && (
                        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors bg-muted/50">
                          <input type="file" id="pdf-upload" accept=".pdf" className="hidden" onChange={(e) => field.onChange(e.target.files?.[0])} />
                          <label htmlFor="pdf-upload" className="cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium">Click para subir el archivo PDF</p>
                            <p className="text-xs text-muted-foreground mt-1">Tamaño máximo recomendado: 10MB</p>
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
                  )
                }}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isPosting || isPatching} className="bg-primary text-primary-foreground">
                {editingItem ? (isPatching ? 'Actualizando...' : 'Actualizar Anuncio') : (isPosting ? 'Guardando...' : 'Guardar Anuncio')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: any, icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl">{value}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}