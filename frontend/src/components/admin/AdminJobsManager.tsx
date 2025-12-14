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
import { zodResolver } from '@hookform/resolvers/zod';
import { type JobPostData,jobSchema } from '../../validations/jobsSchema';


export function AdminJobsManager() {
  const { register, handleSubmit, formState: { errors }, control, reset } = useForm<JobPostData>(
    { resolver: zodResolver(jobSchema),
      defaultValues: {
        title: '',
        description: '',
        company: '',
        location: '',
        type: '',
        salary: '',
        requirements: [""],
        responsibilities: [""],
        pdf: null,
        status: '',
     }
    }
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const jobsItems = [
    { id: 1, title: 'Ingeniero Civil Senior', company: 'Constructora Andes', status: 'Publicado', date: '2025-10-20' },
    { id: 2, title: 'Ingeniero Estructural', company: 'Diseños Bolivia', status: 'Publicado', date: '2025-10-18' },
    { id: 3, title: 'Supervisor de Obra', company: 'Energía Limpia', status: 'Borrador', date: '2025-10-15' },
  ];

  const handleCreate = () => {
    reset({
      title: '',
      description: '',
      company: '',
      location: '',
      type: '',
      salary: '',
      requirements: [""],
      responsibilities: [""],
      pdf: null,
      status: '',
    })
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    reset({
      ...item,
      requirements: item.requirements || [""],
      responsibilities: item.responsibilities || [""],
      pdf: null,
    });
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta oferta laboral?')) {
      console.log('Eliminando oferta:', id);
    }
  };

  const handleSave: SubmitHandler<JobPostData> = (data) => {
    setIsDialogOpen(false);
    console.log('Guardando oferta:', data);
    reset();
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
                {jobsItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.company}</TableCell>
                    <TableCell>
                      <Badge className={item.status === 'Activo' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-foreground'}>
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
                {editingItem ? 'Editar' : 'Crear'} Oferta Laboral
              </DialogTitle>
              <DialogDescription>
                Completa los campos para {editingItem ? 'actualizar' : 'crear'} la oferta laboral
              </DialogDescription>
            </DialogHeader>
            
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Título del Puesto *</Label>
                  <Input id="jobTitle" placeholder="Título de la oferta laboral" {...register("title")} />
                  {errors.title && (
                    <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                      <AlertTitle className='text-sm'>Error en el título</AlertTitle>
                      <AlertDescription className='text-xs'>{errors.title?.message}</AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa *</Label>
                  <Input id="company" placeholder="Nombre de la empresa" {...register("company")} />
                  {errors.company && (
                    <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                      <AlertTitle className='text-sm'>Error en la empresa</AlertTitle>
                      <AlertDescription className='text-xs'>{errors.company?.message}</AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación *</Label>
                    <Input id="location" placeholder="Ciudad" {...register("location")} />
                    {errors.location && (
                      <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                        <AlertTitle className='text-sm'>Error en la ubicación</AlertTitle>
                        <AlertDescription className='text-xs'>{errors.location?.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo *</Label>
                    <Controller
                      name="type"
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
                        {errors.type && (
                          <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                            <AlertTitle className='text-sm'>Error en el tipo</AlertTitle>
                            <AlertDescription className='text-xs'>{errors.type?.message}</AlertDescription>
                          </Alert>
                        )}
                        </>
                      )}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary">Salario</Label>
                  <Input type="number" id="salary" placeholder="Rango salarial (opcional)" {...register("salary")} />
                  {errors.salary && (
                    <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                      <AlertTitle className='text-sm'>Error en el salario</AlertTitle>
                      <AlertDescription className='text-xs'>{errors.salary?.message}</AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea id="description" placeholder="Descripción del puesto" rows={4} {...register("description")} />
                  {errors.description && (
                    <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                      <AlertTitle className='text-sm'>Error en la descripción</AlertTitle>
                      <AlertDescription className='text-xs'>{errors.description?.message}</AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <Controller
                  name="requirements"
                  control={control}
                  render={({field}) => (
                    <>
                    <DynamicList
                      label="Requisito"
                      placeholder="Ingrese un requisito"
                      items={field.value}
                      onChange={field.onChange}
                      required
                      error={errors.requirements}
                    />
                    {errors.requirements && typeof errors.requirements.message === 'string' && (
                      <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                        <AlertTitle className='text-sm'>Error en los requisitos</AlertTitle>
                        <AlertDescription className='text-xs'>{errors.requirements?.message}</AlertDescription>
                      </Alert>
                    )}
                    </>
                  )}
                />

                <Controller
                  name="responsibilities"
                  control={control}
                  render={({field}) => (
                    <>
                    <DynamicList
                      label="Responsabilidad"
                      placeholder="Ingrese una responsabilidad"
                      items={field.value}
                      onChange={field.onChange}
                      required
                      error={errors.responsibilities}
                    />
                    {errors.responsibilities && typeof errors.responsibilities.message === 'string' && (
                      <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                        <AlertTitle className='text-sm'>Error en las responsabilidades</AlertTitle>
                        <AlertDescription className='text-xs'>{errors.responsibilities?.message}</AlertDescription>
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
                        <Label htmlFor="jobPdf">Documento PDF (Opcional)</Label>
                        {file ? (
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
                        ) : (
                          <div className="border-2 border-dashed border-input rounded-md p-4 text-center hover:border-primary transition-colors">
                            <input
                              type="file"
                              id="jobPdf"
                              accept=".pdf"
                              onChange={handlePdfChange}
                              className="hidden"
                            />
                            <label htmlFor="jobPdf" className="cursor-pointer">
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
                  <Label htmlFor="status">Estado *</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Borrador">Borrador</SelectItem>
                          <SelectItem value="Publicado">Publicado</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.status && (
                        <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                          <AlertTitle className='text-sm'>Error en el estado</AlertTitle>
                          <AlertDescription className='text-xs'>{errors.status?.message}</AlertDescription>
                        </Alert>
                      )}
                    </>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground">
                  Guardar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </>
  );
}
