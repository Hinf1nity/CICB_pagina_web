import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Plus, Edit, Trash2, Eye, Upload, FileText, Image as ImageIcon, X } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { type NewsPostData, useNewsPost } from '../hooks/useNews';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsSchema } from '../validations/newsSchema';

export function AdminNewsManager() {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<NewsPostData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
        title: '',
        excerpt: '',
        img: null,
        pdf: null,
        content: '',
    },
    });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newsImagePreview, setNewsImagePreview] = useState<string>('');
  const { postNews } = useNewsPost();

  const newsItems = [
    { id: 1, title: 'Convocatoria Asamblea General', category: 'Institucional', status: 'Publicado', date: '2025-10-22' },
    { id: 2, title: 'Nuevo Reglamento de Proyectos', category: 'Normativa', status: 'Publicado', date: '2025-10-18' },
    { id: 3, title: 'Seminario Internacional', category: 'Eventos', status: 'Borrador', date: '2025-10-15' },
  ];

  const handleCreate = () => {
    setEditingItem(null);
    setNewsImagePreview('');
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta noticia?')) {
      console.log('Eliminando noticia:', id);
    }
  };

  const handleSave: SubmitHandler<NewsPostData> = (data) => {
      setIsDialogOpen(false);
      console.log('Guardando oferta:', data);
      // const res = await postNews(data);
      // console.log('Respuesta del servidor:', res);
      reset();
    };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestión de Noticias</CardTitle>
              <CardDescription>Administra las noticias publicadas en el portal</CardDescription>
            </div>
            <Button onClick={handleCreate} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Noticia
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={item.status === 'Publicado' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-foreground'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString('es-BO')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit(handleSave)}>
                <DialogHeader>
                    <DialogTitle>
                    {editingItem ? 'Editar' : 'Crear'} Noticia
                    </DialogTitle>
                    <DialogDescription>
                    Completa los campos para {editingItem ? 'actualizar' : 'crear'} la noticia
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input id="title" placeholder="Título de la noticia" {...register('title')} />
                    </div>
                    
                    <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Controller
                        name="category"
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="institucional">Institucional</SelectItem>
                                <SelectItem value="normativa">Normativa</SelectItem>
                                <SelectItem value="eventos">Eventos</SelectItem>
                                <SelectItem value="premios">Premios</SelectItem>
                                <SelectItem value="capacitacion">Capacitación</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                    </div>

                    <Controller
                        name="img"
                        control={control}
                        render={({ field }) => {

                            const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            if (file.size > 5 * 1024 * 1024) {
                                alert("La imagen no debe superar los 5MB");
                                return;
                            }

                            // Actualizamos React Hook Form
                            field.onChange(file);

                            // Actualizamos el preview
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setNewsImagePreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                            };

                            const removeImage = () => {
                            field.onChange(null);
                            setNewsImagePreview("");
                            };

                            return (
                            <div className="space-y-2">
                                <Label htmlFor="newsImage">Imagen Principal *</Label>

                                {newsImagePreview ? (
                                <div className="relative">
                                    <img
                                    src={newsImagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-md border border-input"
                                    />
                                    <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={removeImage}
                                    >
                                    <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                ) : (
                                <div className="border-2 border-dashed border-input rounded-md p-6 text-center hover:border-primary transition-colors">
                                    <input
                                    type="file"
                                    id="newsImage"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    />
                                    <label htmlFor="newsImage" className="cursor-pointer">
                                    <ImageIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-muted-foreground mb-1">Haz clic para seleccionar una imagen</p>
                                    <p className="text-muted-foreground">JPG, PNG o GIF (máx. 5MB)</p>
                                    </label>
                                </div>
                                )}

                                {errors.img && (
                                <p className="text-red-500 text-sm">{errors.img.message}</p>
                                )}
                            </div>
                            );
                        }}
                        />
                    
                    <div className="space-y-2">
                    <Label htmlFor="excerpt">Extracto *</Label>
                    <Textarea id="excerpt" placeholder="Breve descripción para la vista previa" rows={3} {...register('excerpt')} />
                    </div>
                    
                    <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                        <div className="space-y-2">
                        <Label>Contenido *</Label>
                        <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Escribe el contenido completo de la noticia aquí. Usa las herramientas para dar formato al texto."
                        />
                        {errors.content && (
                            <p className="text-red-500 text-sm">{errors.content.message}</p>
                        )}
                        </div>
                    )}
                    />

                    <Controller
                        name="pdf"
                        control={control}
                        render={({ field }) => {
                            const file = field.value;

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
                                <Label htmlFor="newsPdf">Documento PDF (Opcional)</Label>
                                {file ? (
                                    <div className="flex items-center justify-between p-3 border border-input rounded-md bg-muted/50">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-destructive" />
                                        <span className="text-foreground">{file.name}</span>
                                        <span className="text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={removePdf}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-input rounded-md p-4 text-center hover:border-primary transition-colors">
                                    <input
                                        type="file"
                                        id="newsPdf"
                                        accept=".pdf"
                                        onChange={handlePdfChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="newsPdf" className="cursor-pointer">
                                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-muted-foreground">Sube un PDF relacionado (máx. 10MB)</p>
                                    </label>
                                    </div>
                                )}
                                {errors.pdf && (
                                <p className="text-red-500 text-sm">{errors.pdf.message}</p>
                                )}
                                </div>
                                );
                            }}
                    />
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Estado *</Label>
                      <Controller
                          control={control}
                          name="status"
                          defaultValue=""
                          render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Selecciona el estado" />
                                  </SelectTrigger>
                                  <SelectContent>
                                  <SelectItem value="borrador">Borrador</SelectItem>
                                  <SelectItem value="publicado">Publicado</SelectItem>
                                  </SelectContent>
                              </Select>
                          )}
                      />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                    </Button>
                    <Button type='submit' className="bg-primary text-primary-foreground">
                    Guardar
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
