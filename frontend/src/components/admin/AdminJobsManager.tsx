import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Plus, Edit, Trash2, Eye, Upload, FileText, X } from 'lucide-react';
import { DynamicList } from '../DynamicList';
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { useJobsPost, useJobPatch, useJobsAdmin, useJobDetailAdmin, useJobDelete } from '../../hooks/useJobs';
import { zodResolver } from '@hookform/resolvers/zod';
import { type JobData, jobSchema } from '../../validations/jobsSchema';

export function AdminJobsManager() {
  const { register, handleSubmit, formState: { errors }, control, reset } = useForm<JobData>(
    {
      resolver: zodResolver(jobSchema),
      defaultValues: {
        titulo: '',
        descripcion: '',
        nombre_empresa: '',
        ubicacion: '',
        tipo_contrato: '',
        salario: '',
        requisitos: [""],
        responsabilidades: [""],
        pdf: null,
        estado: '',
      }
    }
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JobData | null>(null);
  const { mutate: postJob, isPending: isPosting } = useJobsPost();
  const { data: jobs = [], refetch: refetchJobs } = useJobsAdmin();
  const { mutate: patchJob, isPending: isPatching } = useJobPatch();
  const { mutate: deleteJob } = useJobDelete();
  // console.log('Errors en el formulario:', errors);

  const handleCreate = () => {
    reset({
      titulo: '',
      descripcion: '',
      nombre_empresa: '',
      ubicacion: '',
      tipo_contrato: '',
      salario: '',
      requisitos: [""],
      responsabilidades: [""],
      pdf: null,
      estado: '',
    })
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = async (item: JobData) => {
    try {
      // 1. Buscamos el detalle completo
      const formattedJob = await useJobDetailAdmin(`${item.id}`);
      
      if (!formattedJob) {
        alert("No se pudo cargar la información del trabajo.");
        return;
      }

      // 2. Preparamos el objeto de edición asegurando que los arrays existan
      const itemToEdit = {
        ...formattedJob,
        requisitos: formattedJob.requisitos?.length ? formattedJob.requisitos : [""],
        responsabilidades: formattedJob.responsabilidades?.length ? formattedJob.responsabilidades : [""],
      };

      // 3. Seteamos estados ANTES de abrir el diálogo
      setEditingItem(itemToEdit);
      reset(itemToEdit); // Esto inyecta los datos al formulario
      setIsDialogOpen(true);
      
    } catch (error) {
      console.error("Error al intentar editar:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta oferta laboral?')) {
      console.log('Eliminando oferta:', id);
      deleteJob(id);
    }
  };


  const handleSave: SubmitHandler<JobData> = (data) => {
    console.log('Guardando oferta:', data);
    if (editingItem && editingItem.id !== undefined) {
      patchJob({ id: editingItem.id, data, data_old: editingItem }, {
        onSuccess: () => {
          setEditingItem(null);
          setIsDialogOpen(false);
          reset();
        }
      });
    } else {
      postJob(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        }
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestión de Ofertas Laborales</CardTitle>
              <CardDescription>Administra las ofertas de trabajo publicadas</CardDescription>
            </div>
            <Button onClick={handleCreate} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Oferta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.titulo}</TableCell>
                    <TableCell>{item.nombre_empresa}</TableCell>
                    <TableCell>
                      <Badge className={item.estado === 'publicado' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-foreground'}>
                        <p className="capitalize">{item.estado}</p>
                      </Badge>
                    </TableCell>
                    <TableCell>{item.fecha_publicacion !== undefined && new Date(item.fecha_publicacion).toLocaleDateString('es-BO')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => item.id !== undefined && handleDelete(item.id)}>
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
                {editingItem ? 'Editar' : 'Crear'} Oferta Laboral
              </DialogTitle>
              <DialogDescription>
                Completa los campos para {editingItem ? 'actualizar' : 'crear'} la oferta laboral
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Título del Puesto *</Label>
                <Input id="jobTitle" placeholder="Título de la oferta laboral" {...register("titulo")} />
                {errors.titulo && (
                  <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                    <AlertTitle className='text-sm'>Error en el título</AlertTitle>
                    <AlertDescription className='text-xs'>{errors.titulo?.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Empresa *</Label>
                <Input id="company" placeholder="Nombre de la empresa" {...register("nombre_empresa")} />
                {errors.nombre_empresa && (
                  <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                    <AlertTitle className='text-sm'>Error en la empresa</AlertTitle>
                    <AlertDescription className='text-xs'>{errors.nombre_empresa?.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sobre_empresa">Información sobre la empresa *</Label>
                <Textarea id="sobre_empresa" placeholder="Información sobre la empresa" rows={4} {...register("sobre_empresa")} />
                {errors.sobre_empresa && (
                  <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                    <AlertTitle className='text-sm'>Error en la información sobre la empresa</AlertTitle>
                    <AlertDescription className='text-xs'>{errors.sobre_empresa?.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación *</Label>
                  <Input id="location" placeholder="Ciudad" {...register("ubicacion")} />
                  {errors.ubicacion && (
                    <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                      <AlertTitle className='text-sm'>Error en la ubicación</AlertTitle>
                      <AlertDescription className='text-xs'>{errors.ubicacion?.message}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo_contrato">Tipo *</Label>
                  <Controller
                    name="tipo_contrato"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de trabajo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="completo">Tiempo Completo</SelectItem>
                            <SelectItem value="contrato">Contrato</SelectItem>
                            <SelectItem value="freelance">Freelance</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.tipo_contrato && (
                          <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                            <AlertTitle className='text-sm'>Error en el tipo</AlertTitle>
                            <AlertDescription className='text-xs'>{errors.tipo_contrato?.message}</AlertDescription>
                          </Alert>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salario">Referencia Salarial</Label>
                <Input type="number" id="salario" placeholder="Rango salarial (opcional)" {...register("salario")} />
                {errors.salario && (
                  <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                    <AlertTitle className='text-sm'>Error en el salario</AlertTitle>
                    <AlertDescription className='text-xs'>{errors.salario?.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea id="descripcion" placeholder="Descripción del puesto" rows={4} {...register("descripcion")} />
                {errors.descripcion && (
                  <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                    <AlertTitle className='text-sm'>Error en la descripción</AlertTitle>
                    <AlertDescription className='text-xs'>{errors.descripcion?.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Controller
                name="requisitos"
                control={control}
                render={({ field }) => (
                  <>
                    <DynamicList
                      label="Requisito"
                      placeholder="Ingrese un requisito"
                      items={field.value}
                      onChange={field.onChange}
                      required
                      error={errors.requisitos}
                    />
                    {errors.requisitos && typeof errors.requisitos.message === 'string' && (
                      <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                        <AlertTitle className='text-sm'>Error en los requisitos</AlertTitle>
                        <AlertDescription className='text-xs'>{errors.requisitos?.message}</AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              />

              <Controller
                name="responsabilidades"
                control={control}
                render={({ field }) => (
                  <>
                    <DynamicList
                      label="Responsabilidad"
                      placeholder="Ingrese una responsabilidad"
                      items={field.value}
                      onChange={field.onChange}
                      required
                      error={errors.responsabilidades}
                    />
                    {errors.responsabilidades && typeof errors.responsabilidades.message === 'string' && (
                      <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                        <AlertTitle className='text-sm'>Error en las responsabilidades</AlertTitle>
                        <AlertDescription className='text-xs'>{errors.responsabilidades?.message}</AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              />

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

                    field.onChange(newFile); // actualiza React Hook Form
                  };

                  const removePdf = () => {
                    field.onChange(null); // limpia el valor en el form
                  };

                  return (
                    <div className="space-y-2">
                      <Label htmlFor="pdf">Documento PDF (Opcional)</Label>
                      {isUrl && (
                        <div className="flex items-center justify-between p-3 border border-input rounded-md bg-muted/50">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-destructive" />
                            <a href={file} target="_blank" rel="noopener noreferrer" className="text-foreground underline">
                              Ver PDF existente
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

                      {!file && (
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

              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Controller
                  name="estado"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="borrador">Borrador</SelectItem>
                          <SelectItem value="publicado">Publicado</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.estado && (
                        <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                          <AlertTitle className='text-sm'>Error en el estado</AlertTitle>
                          <AlertDescription className='text-xs'>{errors.estado?.message}</AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPosting || isPatching} className="bg-primary text-primary-foreground">
                {editingItem ? (isPatching ? 'Actualizando...' : 'Actualizar Trabajo') : (isPosting ? 'Guardando...' : 'Guardar Trabajo')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}