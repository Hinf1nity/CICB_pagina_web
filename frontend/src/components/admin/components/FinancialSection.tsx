import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Save } from "lucide-react";
import { Label } from "../../ui/label";
import { useAdminIncidenciasPatch } from "../../../hooks/useAdminAranceles";
interface Prop {
    id: number;
    valor: number;
}

export const FinancialSection = ({ salario, ipcNacional, incidenciasMaestria, incidenciaSenior }: { salario: Prop; ipcNacional: Prop; incidenciasMaestria: number; incidenciaSenior: number }) => {
    const { mutate: patchIncidencias } = useAdminIncidenciasPatch();
    const { register, handleSubmit } = useForm({
        defaultValues: { salario, ipcNacional }
    });

    const onSave = (data: any) => {
        const financialOrganized = [
            { id: data.salario.id, valor: data.salario.valor },
            { id: data.ipcNacional.id, valor: data.ipcNacional.valor }
        ];
        const financialOldOrganized = [
            { id: salario.id, valor: salario.valor },
            { id: ipcNacional.id, valor: ipcNacional.valor }
        ];
        patchIncidencias({ oldData: financialOldOrganized, data: financialOrganized });
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSave)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-[#B0B0B0]/30">
                        <CardHeader className="bg-[#0B3D2E]/5">
                            <CardTitle className="text-[#0B3D2E]">Salario Base</CardTitle>
                            <CardDescription>Salario base de referencia para cálculos (en BOB)</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="baseSalary">Monto en Bolivianos (BOB)</Label>
                                <Input hidden {...register("salario.id")} />
                                <Input
                                    id="baseSalary"
                                    type="number"
                                    step="10"
                                    className="text-2xl font-bold text-[#0B3D2E]"
                                    {...register("salario.valor", { valueAsNumber: true })}
                                />
                                <p className="text-sm text-gray-500">
                                    Este valor se utiliza como base para todos los cálculos de aranceles
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-[#B0B0B0]/30">
                        <CardHeader className="bg-[#0B3D2E]/5">
                            <CardTitle className="text-[#0B3D2E]">IPC Nacional</CardTitle>
                            <CardDescription>Índice de Precios al Consumidor a nivel nacional</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="nationalIPC">Factor Multiplicador</Label>
                                <Input hidden {...register("ipcNacional.id")} />
                                <Input
                                    id="nationalIPC"
                                    type="number"
                                    step="0.01"
                                    {...register("ipcNacional.valor", { valueAsNumber: true })}
                                    className="text-2xl font-bold text-[#0B3D2E]"
                                />
                                <p className="text-sm text-gray-500">
                                    Factor de ajuste general aplicado a todos los cálculos
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-[#B0B0B0]/30 bg-gradient-to-br from-[#0B3D2E]/5 to-[#3C8D50]/5">
                    <CardHeader>
                        <CardTitle className="text-[#0B3D2E]">Vista Previa de Cálculo</CardTitle>
                        <CardDescription>Ejemplo con profesional Senior (15 años) con Maestría</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 bg-white rounded-lg border-2 border-[#0B3D2E]/20">
                                <div className="text-sm text-gray-600 mb-1">Salario Base Mensual</div>
                                <div className="text-2xl font-bold text-[#0B3D2E]">
                                    {salario.valor.toLocaleString('es-BO')} BOB
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-lg border-2 border-[#1B5E3A]/20">
                                <div className="text-sm text-gray-600 mb-1">Con Multiplicador Maestría ({incidenciasMaestria})</div>
                                <div className="text-2xl font-bold text-[#1B5E3A]">
                                    {(salario.valor * incidenciasMaestria).toLocaleString('es-BO')} BOB
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-lg border-2 border-[#3C8D50]/20">
                                <div className="text-sm text-gray-600 mb-1">Con Experiencia (Senior en ciudad)</div>
                                <div className="text-2xl font-bold text-[#3C8D50]">
                                    {(salario.valor * incidenciasMaestria * incidenciaSenior).toLocaleString('es-BO')} BOB
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex justify-end">
                    <Button className="bg-[#0B3D2E] hover:bg-[#1B5E3A]">
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Configuración Financiera
                    </Button>
                </div>
            </form>
        </div>
    )
};