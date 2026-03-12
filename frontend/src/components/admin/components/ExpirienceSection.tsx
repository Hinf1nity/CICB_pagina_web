import { useForm, useFieldArray } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Save } from "lucide-react";
import { useAdminIncidenciasPatch } from "../../../hooks/useAdminAranceles";

interface Props {
    antiguedadData: any[];
}

export const ExperienceSection = ({ antiguedadData }: Props) => {
    const { mutate: patchIncidencia } = useAdminIncidenciasPatch();
    const { register, control, handleSubmit } = useForm({
        defaultValues: { antiguedad: antiguedadData }
    });

    const { fields } = useFieldArray({ control, name: "antiguedad" });

    const onSave = (data: any) => {
        const dataOrganized = data.antiguedad.flatMap((data: any) =>
            Object.values(data.valores).map((item: any) => {
                const { id, valor } = item as { id: any; valor: any };
                return { id, valor };
            })
        );
        const dataOldOrganized = antiguedadData.flatMap((data: any) =>
            Object.values(data.valores).map((item: any) => {
                const { id, valor } = item as { id: any; valor: any };
                return { id, valor };
            })
        );
        patchIncidencia({ oldData: dataOldOrganized, data: dataOrganized });
    };

    return (
        <div>
            <Card className="border-[#B0B0B0]/30">
                <CardHeader className="bg-[#0B3D2E]/5">
                    <CardTitle className="text-[#0B3D2E]">Niveles de Experiencia</CardTitle>
                    <CardDescription>Configure los rangos de años de experiencia y sus multiplicadores anuales</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSave)}>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#F2F2F2]">
                                    <TableHead className="text-[#0B3D2E]">Nivel</TableHead>
                                    <TableHead className="text-[#0B3D2E]">Años Mínimos</TableHead>
                                    <TableHead className="text-[#0B3D2E]">Años Máximos</TableHead>
                                    <TableHead className="text-[#0B3D2E]">Multiplicador de Ciudad</TableHead>
                                    <TableHead className="text-[#0B3D2E]">Multiplicador de Campo</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.map((field: any, index: number) => (
                                    'valores' in field ? (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{field.nombre}</TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    id={field.valores.min.id}
                                                    className="max-w-[100px]"
                                                    {...register(`antiguedad.${index}.valores.min.valor`, { valueAsNumber: true })}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    id={field.valores.max.id}
                                                    className="max-w-[100px]"
                                                    {...register(`antiguedad.${index}.valores.max.valor`, { valueAsNumber: true })}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    id={field.valores.ciudad.id}
                                                    className="max-w-[100px]"
                                                    {...register(`antiguedad.${index}.valores.ciudad.valor`, { valueAsNumber: true })}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    id={field.valores.campo.id}
                                                    className="max-w-[100px]"
                                                    {...register(`antiguedad.${index}.valores.campo.valor`, { valueAsNumber: true })}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ) : null
                                ))}
                            </TableBody>
                        </Table>
                        <div className="mt-4 flex justify-end">
                            <Button className="bg-[#0B3D2E] hover:bg-[#1B5E3A]" type="submit">
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Experiencia Laboral
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}