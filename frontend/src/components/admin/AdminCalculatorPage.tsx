import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
    Calculator,
    GraduationCap,
    MapPin,
    DollarSign,
    Briefcase,
    FileText,
    ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EducationSection } from "./components/EducationSection";
import { ExperienceSection } from "./components/ExpirienceSection";
import { GeographySection } from "./components/GeographySection";
import { FinancialSection } from "./components/FinancialSection";
import { ActivitySection } from "./components/ActivitySection";
import { WorkCostsSection } from "./components/WorkCostsSection";
import { useAdminAranceles } from "../../hooks/useAdminAranceles";

export function AdminCalculatorPage() {
    const navigate = useNavigate();

    const { aranceles, incidenciasClean, isPending, isError } = useAdminAranceles();
    const valorMaestria = incidenciasClean?.form.find((item: any) => item.nombre === "Maestría")?.valor || 0;
    const valorSenior = incidenciasClean?.ant.find((item: any) => item.nombre === "senior")?.valores.ciudad.valor || 0;
    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Calculator className="w-12 h-12 mx-auto mb-4 animate-spin text-[#0B3D2E]" />
                    <p className="text-lg text-[#0B3D2E]">Cargando datos de aranceles...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Calculator className="w-12 h-12 mx-auto mb-4 text-red-600" />
                    <p className="text-lg text-red-600">Error al cargar datos de aranceles. Por favor, intente nuevamente.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F2F2F2]">
            {/* Header */}
            <div className="bg-[#0B3D2E] text-white py-6 px-8">
                <div className="max-w-7xl mx-auto">
                    <Button
                        variant="ghost"
                        className="text-white hover:bg-white/10 mb-4"
                        onClick={() => navigate("/admin")}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Panel
                    </Button>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/10 p-3 rounded-lg">
                                <Calculator className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Administración de Calculadora de Aranceles</h1>
                                <p className="text-white/80 mt-1">
                                    Configure los parámetros, multiplicadores y costos para el cálculo de aranceles profesionales
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-8">
                <Tabs defaultValue="education" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 bg-white border-2 border-[#B0B0B0]/30">
                        <TabsTrigger value="education" className="data-[state=active]:bg-[#0B3D2E] data-[state=active]:text-white">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Educación
                        </TabsTrigger>
                        <TabsTrigger value="geography" className="data-[state=active]:bg-[#0B3D2E] data-[state=active]:text-white">
                            <MapPin className="w-4 h-4 mr-2" />
                            Geografía
                        </TabsTrigger>
                        <TabsTrigger value="financial" className="data-[state=active]:bg-[#0B3D2E] data-[state=active]:text-white">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Financiero
                        </TabsTrigger>
                        <TabsTrigger value="activities" className="data-[state=active]:bg-[#0B3D2E] data-[state=active]:text-white">
                            <Briefcase className="w-4 h-4 mr-2" />
                            Actividades
                        </TabsTrigger>
                        <TabsTrigger value="workcosts" className="data-[state=active]:bg-[#0B3D2E] data-[state=active]:text-white">
                            <FileText className="w-4 h-4 mr-2" />
                            Costos
                        </TabsTrigger>
                    </TabsList>

                    {/* Educación y Experiencia */}
                    <TabsContent value="education" className="space-y-6">
                        <EducationSection initialData={incidenciasClean?.form || []} />
                        <ExperienceSection antiguedadData={incidenciasClean?.ant || []} />
                    </TabsContent>

                    {/* Multiplicadores Geográficos */}
                    <TabsContent value="geography" className="space-y-6">
                        <GeographySection geographyData={incidenciasClean?.departamentos || []} />
                    </TabsContent>

                    {/* Configuración Financiera */}
                    <TabsContent value="financial" className="space-y-6">
                        <FinancialSection salario={incidenciasClean?.salario[0] || {}} ipcNacional={incidenciasClean?.ipc_nacional[0] || {}} incidenciasMaestria={valorMaestria} incidenciaSenior={valorSenior} />
                    </TabsContent>

                    {/* Gestión de Actividades */}
                    <TabsContent value="activities" className="space-y-6">
                        <ActivitySection activitiesData={incidenciasClean?.actividad || []} />
                    </TabsContent>

                    {/* Costos de Trabajo */}
                    <TabsContent value="workcosts" className="space-y-6">
                        <WorkCostsSection aranceles={aranceles || []} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}