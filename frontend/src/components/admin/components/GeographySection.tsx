import { useForm, useFieldArray } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Save } from "lucide-react";
import { useAdminIncidenciasPatch } from "../../../hooks/useAdminAranceles";

interface Props {
    geographyData: any[];
}

export const GeographySection = ({ geographyData }: Props) => {
    const { mutate: patchIncidencias } = useAdminIncidenciasPatch();
    const { register, control, handleSubmit } = useForm({
        defaultValues: { geografia: geographyData }
    });

    const { fields } = useFieldArray({ control, name: "geografia" });

    const onSave = (data: any) => {
        const geographyOrganized = data.geografia.flatMap((depto: any) => [
            { id: depto.id_fce, valor: depto.fce }, // Primer registro: FCE
            { id: depto.id_ipc, valor: depto.ipc }  // Segundo registro: IPC
        ]);
        const geographyOldOrganized = geographyData.flatMap((depto: any) => [
            { id: depto.id_fce, valor: depto.fce }, // Primer registro: FCE
            { id: depto.id_ipc, valor: depto.ipc }  // Segundo registro: IPC
        ]);
        patchIncidencias({ oldData: geographyOldOrganized, data: geographyOrganized });
    };

    return (
        <div>
            <Card className="border-[#B0B0B0]/30">
                <CardHeader className="bg-[#0B3D2E]/5">
                    <CardTitle className="text-[#0B3D2E]">Multiplicadores por Departamento</CardTitle>
                    <CardDescription>Configure los multiplicadores geográficos para los 9 departamentos de Bolivia</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSave)}>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#F2F2F2]">
                                        <TableHead className="text-[#0B3D2E]">Departamento</TableHead>
                                        <TableHead className="text-[#0B3D2E] text-right">IPC</TableHead>
                                        <TableHead className="text-[#0B3D2E] text-right">FCE</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((dept: any, index) => (
                                        <TableRow key={dept.id}>
                                            <TableCell className="font-medium">{dept.nombre}</TableCell>
                                            <TableCell className="text-right">
                                                <Input hidden {...register(`geografia.${index}.id_ipc`)} />
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    className="max-w-[100px] ml-auto"
                                                    {...register(`geografia.${index}.ipc`, { valueAsNumber: true })}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Input hidden {...register(`geografia.${index}.id_fce`)} />
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    className="max-w-[100px] ml-auto"
                                                    {...register(`geografia.${index}.fce`, { valueAsNumber: true })}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-[#1B5E3A]/10 rounded-lg border border-[#1B5E3A]/20">
                                <h4 className="font-semibold text-[#0B3D2E] mb-2">IPC - Índice de Precios al Consumidor</h4>
                                <p className="text-sm text-gray-600">Refleja el costo de vida en cada departamento</p>
                            </div>
                            <div className="p-4 bg-[#3C8D50]/10 rounded-lg border border-[#3C8D50]/20">
                                <h4 className="font-semibold text-[#0B3D2E] mb-2">FCE - Factor de Costo Económico</h4>
                                <p className="text-sm text-gray-600">Ajuste económico regional específico</p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button className="bg-[#0B3D2E] hover:bg-[#1B5E3A]">
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Configuración Geográfica
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}