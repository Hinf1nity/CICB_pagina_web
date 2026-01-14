import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Megaphone, Plus, Edit, Trash2, Search, Calendar, Download, ArrowLeft, Upload, X, Eye, FileEdit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { type GenericData, genericSchema } from '../../validations/genericSchema';
import { useItemsAdmin, useItemPost, useItemPatch, useItemDelete } from '../../hooks/useItems';

export function AdminAnnouncementsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GenericData | null>(null);

  const { items: announcements, refetchItems, loading } = useItemsAdmin("announcements");
  const { postItem } = useItemPost();
  const { patchItem } = useItemPatch();
  const { deleteItem } = useItemDelete();

  const stats = {
    total: announcements.length,
    activas: announcements.filter(a => a.estado === 'activa').length,
    borradores: announcements.filter(a => a.estado === 'borrador').length,
    cerradas: announcements.filter(a => a.estado === 'cerrada').length,
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

  const handleEdit = (item: GenericData) => {
    setEditingItem(item);
    reset({
      ...item,
      fecha_publicacion: item.fecha_publicacion ? new Date(item.fecha_publicacion).toISOString().split('T')[0] : '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
      await deleteItem(id, "announcements");
      refetchItems();
    }
  };

  const handleSave: SubmitHandler<GenericData> = async (data) => {
    try {
      if (editingItem?.id) {
        await patchItem(editingItem.id, data, editingItem, "announcements");
      } else {
        await postItem(data, "announcements");
      }
      refetchItems();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error al guardar:", error);
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

        <div className="flex gap-4 mb-6 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar convocatorias por título o fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleCreate}
            className="bg-primary text-primary-foreground"
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
              {announcements.length} convocatoria(s) encontrada(s)
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {announcements
                .filter(a =>
                  a.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item) => (
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
                        size="icon"
                        onClick={() => item.id && handleDelete(item.id)}
                        className="border-gray-200 hover:bg-red-50 hover:border-red-200"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
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
                <Label className="text-[#003D33] font-semibold">Título</Label>
                <Input
                  {...register("nombre")}
                  placeholder="Título de la convocatoria..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#003D33] font-semibold">Descripción</Label>
                <Textarea
                  {...register("descripcion")}
                  placeholder="Descripción detallada..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#003D33] font-semibold">Fecha de Publicación</Label>
                  <Input type="date" {...register("fecha_publicacion")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#003D33] font-semibold">Estado</Label>
                  <Controller
                    control={control}
                    name="estado"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="borrador">Borrador</SelectItem>
                          <SelectItem value="activa">Activa</SelectItem>
                          <SelectItem value="cerrada">Cerrada</SelectItem>
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
                  <div className="flex flex-col gap-2 pt-2">
                    <Label className="text-[#003D33] font-semibold">Documento PDF</Label>
                    {field.value instanceof File ? (
                      <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span className="truncate font-medium">{field.value.name}</span>
                        <X className="w-5 h-5 cursor-pointer text-gray-400 hover:text-red-500" onClick={() => field.onChange(null)} />
                      </div>
                    ) : (
                      <label className="cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-6 w-full text-center hover:bg-gray-50 transition-all">
                        <Input type="file" className="hidden" accept=".pdf" onChange={(e) => field.onChange(e.target.files?.[0])} />
                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                        <span className="text-sm text-gray-500 font-medium font-sans">Subir PDF</span>
                      </label>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-[#003D33] hover:bg-[#002D26] px-8">
                {editingItem ? 'Guardar Cambios' : 'Crear Convocatoria'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ title, value, icon }) {
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