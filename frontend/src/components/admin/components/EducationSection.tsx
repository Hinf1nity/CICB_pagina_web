import { useForm, useFieldArray } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Save, Trash2, Plus } from "lucide-react";
import { type Incidencia } from "../../../validations/adminArancelesSchema";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { Label } from "../../ui/label";
import { useState } from "react";
import { useAdminIncidenciasPatch, useAdminIncidenciasPost, useAdminIncidenciasDelete } from "../../../hooks/useAdminAranceles";

interface Props {
    initialData: Incidencia[];
}

export const EducationSection = ({ initialData }: Props) => {
    const [isAddEducationOpen, setIsAddEducationOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { mutate: patchIncidencia } = useAdminIncidenciasPatch();
    const { mutate: postIncidencia } = useAdminIncidenciasPost();
    const { mutate: deleteIncidencia } = useAdminIncidenciasDelete();
    const { register, control, handleSubmit } = useForm({
        defaultValues: { formacion: initialData }
    });

    const { fields, remove, append } = useFieldArray({ control, name: "formacion" });

    const { register: registerNew, handleSubmit: handleSubmitNew, reset, formState: { errors } } = useForm({
        defaultValues: {
            nombre: "",
            valor: 0
        }
    });

    const onSave = (data: any) => {
        if (data.formacion && data.formacion.length > 0) {
            patchIncidencia({ oldData: initialData, data: data.formacion });
        }
    };

    const onAddEducation = (data: any) => {
        setIsLoading(true);
        postIncidencia({ nombre: `form_${data.nombre}`, valor: data.valor }, {
            onSuccess: () => {
                append({ id: Date.now(), nombre: `${data.nombre}`, valor: data.valor });
                reset();
                setIsAddEducationOpen(false);
            }
        });
        setIsLoading(false);
    }

    const onDeleteEducation = (id: number) => {
        deleteIncidencia(id);
    };

    return (
        <div>
            <Card className="border-[#B0B0B0]/30">
                <CardHeader className="bg-[#0B3D2E]/5">
                    <CardTitle className="text-[#0B3D2E]">Grados de Educación</CardTitle>
                    <CardDescription>Configure los niveles académicos y sus multiplicadores</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSave)}>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#F2F2F2]">
                                    <TableHead className="text-[#0B3D2E]">Nombre</TableHead>
                                    <TableHead className="text-[#0B3D2E]">Nombre para Mostrar</TableHead>
                                    <TableHead className="text-[#0B3D2E] text-right">Multiplicador</TableHead>
                                    <TableHead className="text-[#0B3D2E] text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>

                                {fields.map((field: any, index: number) => (
                                    <TableRow key={field.id}>
                                        <TableCell className="font-medium">
                                            <Input hidden {...register(`formacion.${index}.id`)} />
                                            {field.nombre}
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                className="max-w-xs"
                                                {...register(`formacion.${index}.nombre`, { required: true })}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                className="max-w-[100px] ml-auto"
                                                {...register(`formacion.${index}.valor`, { required: true, valueAsNumber: true })}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                type="button"
                                                onClick={() => {
                                                    if (confirm("¿Está seguro de eliminar este grado de educación?")) {
                                                        onDeleteEducation(initialData[index].id)
                                                        remove(index)
                                                    }
                                                }}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                        <div className="mt-4 flex justify-end">
                            <Button className="bg-[#0B3D2E] hover:bg-[#1B5E3A]" type="submit">
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Formación Académica
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4">
                        <Dialog open={isAddEducationOpen} onOpenChange={setIsAddEducationOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#3C8D50] hover:bg-[#1B5E3A]">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Agregar Grado
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <form onSubmit={handleSubmitNew(onAddEducation)}>
                                    <DialogHeader>
                                        <DialogTitle>Agregar Nuevo Grado de Educación</DialogTitle>
                                        <DialogDescription>
                                            Defina un nuevo grado académico con su multiplicador correspondiente
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="educationName">Nombre del Grado<span className="text-red-500">*</span></Label>
                                            <Input
                                                id="educationName"
                                                placeholder="Ej: Licenciatura"
                                                {...registerNew("nombre", { required: "El nombre es obligatorio" })}
                                            />
                                            {errors.nombre && (
                                                <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                                    <AlertTitle className='text-sm'>Error en el Título</AlertTitle>
                                                    <AlertDescription className='text-xs'>{errors.nombre?.message}</AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="educationMultiplier">Multiplicador<span className="text-red-500">*</span></Label>
                                            <Input
                                                id="educationMultiplier"
                                                type="number"
                                                step="0.1"
                                                placeholder="Ej: 1.2"
                                                {...registerNew("valor", { required: "El multiplicador es obligatorio", valueAsNumber: true, min: 0 })}
                                            />
                                            {errors.valor && (
                                                <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                                    <AlertTitle className='text-sm'>Error en el Multiplicador</AlertTitle>
                                                    <AlertDescription className='text-xs'>{errors.valor?.message}</AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            className="bg-[#0B3D2E] hover:bg-[#1B5E3A]"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Guardando..." : "Agregar"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};