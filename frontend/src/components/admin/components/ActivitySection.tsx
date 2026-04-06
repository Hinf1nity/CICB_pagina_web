import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Save, Trash2, Plus, Briefcase } from "lucide-react";
import { Label } from "../../ui/label";
import { useFieldArray, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { type Incidencia } from "../../../validations/adminArancelesSchema";
import { useAdminIncidenciasPatch, useAdminIncidenciasPost, useAdminIncidenciasDelete } from "../../../hooks/useAdminAranceles";

interface Props {
    activitiesData: Incidencia[];
}

export const ActivitySection = ({ activitiesData }: Props) => {
    const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { mutate: patchIncidencia } = useAdminIncidenciasPatch();
    const { mutate: postIncidencia } = useAdminIncidenciasPost();
    const { mutate: deleteIncidencia } = useAdminIncidenciasDelete();
    const { register, control, handleSubmit } = useForm({
        defaultValues: { actividades: activitiesData }
    });

    const { fields, remove, append } = useFieldArray({ control, name: "actividades" });
    const onSave = (data: any) => {
        if (!data.actividades || data.actividades.length === 0) {
            return;
        }
        patchIncidencia({ oldData: activitiesData, data: data.actividades });
    };

    const { register: registerNew, handleSubmit: handleSubmitNew, formState: { errors: errorsNew }, reset } = useForm({
        defaultValues: {
            nombre: "",
            valor: 0
        }
    });

    const onAddActivity = (data: any) => {
        setIsLoading(true);
        postIncidencia({ nombre: `actividad_${data.nombre}`, valor: data.valor }, {
            onSuccess: () => {
                append({ id: Date.now(), nombre: data.nombre, valor: data.valor });
                reset();
                setIsAddActivityOpen(false);
            }
        });
        setIsLoading(false);
    };

    const onDeleteActivity = (id: number) => {
        deleteIncidencia(id);
    }

    return (
        <div>
            <Card className="border-[#B0B0B0]/30">
                <CardHeader className="bg-[#0B3D2E]/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-[#0B3D2E]">Tipos de Actividades Profesionales</CardTitle>
                            <CardDescription>Configure las actividades y sus multiplicadores de costo</CardDescription>
                        </div>
                        <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#3C8D50] hover:bg-[#1B5E3A]">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Agregar Actividad
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <form onSubmit={handleSubmitNew(onAddActivity)}>
                                    <DialogHeader>
                                        <DialogTitle>Agregar Nueva Actividad</DialogTitle>
                                        <DialogDescription>
                                            Defina una nueva actividad profesional con su multiplicador correspondiente
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="activityName">Nombre de la Actividad<span className="text-red-500">*</span></Label>
                                            <Input
                                                id="activityName"
                                                placeholder="Ej: Evaluación"
                                                {...registerNew(`nombre`, { required: "El nombre de la actividad es obligatorio" })}
                                            />
                                            {errorsNew.nombre && (
                                                <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                                    <AlertTitle className='text-sm'>Error en el Nombre de la Actividad</AlertTitle>
                                                    <AlertDescription className='text-xs'>{errorsNew.nombre?.message}</AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="activityMultiplier">Multiplicador<span className="text-red-500">*</span></Label>
                                            <Input
                                                id="activityMultiplier"
                                                type="number"
                                                step="0.1"
                                                placeholder="Ej: 1.15"
                                                {...registerNew(`valor`, { valueAsNumber: true, required: "El multiplicador es obligatorio" })}
                                            />
                                            {errorsNew.valor && (
                                                <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                                    <AlertTitle className='text-sm'>Error en el Multiplicador</AlertTitle>
                                                    <AlertDescription className='text-xs'>{errorsNew.valor?.message}</AlertDescription>
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
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSave)}>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#F2F2F2]">
                                    <TableHead className="text-[#0B3D2E]">ID</TableHead>
                                    <TableHead className="text-[#0B3D2E]">Nombre de Actividad</TableHead>
                                    <TableHead className="text-[#0B3D2E] text-right">Multiplicador</TableHead>
                                    <TableHead className="text-[#0B3D2E] text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell className="font-mono text-xs text-gray-500">
                                            {index + 1}
                                            <Input hidden {...register(`actividades.${index}.id`)} />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                {...register(`actividades.${index}.nombre`)}
                                                className="max-w-xs"
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...register(`actividades.${index}.valor`, { valueAsNumber: true })}
                                                className="max-w-[120px] ml-auto"
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                type="button"
                                                onClick={() => {
                                                    if (confirm("¿Está seguro de eliminar esta actividad?")) {
                                                        onDeleteActivity(activitiesData[index].id)
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
                        {fields.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No hay actividades configuradas. Agregue una nueva actividad.</p>
                            </div>
                        )}
                        <div className="mt-4 flex justify-end">
                            <Button type="submit" className="bg-[#0B3D2E] hover:bg-[#1B5E3A]">
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Actividades
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
};