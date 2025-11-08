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
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Plus, Edit, Trash2, Eye, Upload, FileText, X } from 'lucide-react';
import { DynamicList } from './DynamicList';
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { type JobPostData } from '../hooks/useJobs';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobSchema } from '../validations/jobsSchema';

export function AdminJobsManager() {
  const { register, handleSubmit, formState: { errors }, control, reset } = useForm<JobPostData>(
    { resolver: zodResolver(jobSchema) }
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const jobsItems = [
    { id: 1, title: 'Ingeniero Civil Senior', company: 'Constructora Andes', status: 'Activo', date: '2025-10-20' },
    { id: 2, title: 'Ingeniero Estructural', company: 'Diseños Bolivia', status: 'Activo', date: '2025-10-18' },
    { id: 3, title: 'Supervisor de Obra', company: 'Energía Limpia', status: 'Expirado', date: '2025-10-15' },
  ];

  const handleCreate = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
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
                  {/* <Alert variant="destructive" className={`${errors.title ? 'block' : 'hidden'}`}>
                    <AlertTitle>Error en el título</AlertTitle>
                    <AlertDescription>
                      {errors.title?.message}
                    </AlertDescription>
                  </Alert> */}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa *</Label>
                  <Input id="company" placeholder="Nombre de la empresa" {...register("company")} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación *</Label>
                    <Input id="location" placeholder="Ciudad" {...register("location")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo *</Label>
                    <Controller
                      name="type"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
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
                      )}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary">Salario</Label>
                  <Input type="number" id="salary" placeholder="Rango salarial (opcional)" {...register("salary")} />
                  <Alert variant="destructive" className={`${errors.salary ? 'block' : 'hidden'}`}>
                    <AlertTitle>Error en el salario</AlertTitle>
                    <AlertDescription>
                      {errors.salary?.message}
                    </AlertDescription>
                  </Alert>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea id="description" placeholder="Descripción del puesto" rows={4} {...register("description")} />
                </div>
                
                <Controller
                  name="requirements"
                  control={control}
                  defaultValue={[""]}
                  render={({field}) => (
                    <DynamicList
                      label="Requisito"
                      placeholder="Ingrese un requisito"
                      items={field.value}
                      onChange={field.onChange}
                      required
                    />
                  )}
                />

                <Controller
                  name="responsibilities"
                  control={control}
                  defaultValue={[""]}
                  render={({field}) => (
                    <DynamicList
                      label="Responsabilidad"
                      placeholder="Ingrese una responsabilidad"
                      items={field.value}
                      onChange={field.onChange}
                      required
                    />
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
                          <p className="text-red-500 text-sm">{errors.pdf.message}</p>
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
