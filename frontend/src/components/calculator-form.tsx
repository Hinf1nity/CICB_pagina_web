import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Building2, TreePine } from "lucide-react";
import { useState } from "react";

interface CalculatorFormProps {
    onSubmit: (data: FormData) => void;
    isLoading: boolean;
}

export interface FormData {
    yearsOfExperience: number;
    department: string;
    educationLevel: string;
    location: string;
    activityType: string;
}

export function CalculatorForm({ onSubmit, isLoading }: CalculatorFormProps) {
    const [selectedLocation, setSelectedLocation] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data: FormData = {
            yearsOfExperience: Number(formData.get('yearsOfExperience')),
            department: formData.get('department') as string,
            educationLevel: formData.get('educationLevel') as string,
            location: formData.get('location') as string,
            activityType: formData.get('activityType') as string,
        };

        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Años de Antigüedad</Label>
                <Input
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    type="number"
                    min="0"
                    max="60"
                    required
                    placeholder="Ej: 5"
                    className="bg-white border-gray-300"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select name="department" required>
                    <SelectTrigger id="department" className="bg-white border-gray-300">
                        <SelectValue placeholder="Seleccione el departamento" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="la-paz">La Paz</SelectItem>
                        <SelectItem value="cochabamba">Cochabamba</SelectItem>
                        <SelectItem value="santa-cruz">Santa Cruz</SelectItem>
                        <SelectItem value="oruro">Oruro</SelectItem>
                        <SelectItem value="potosi">Potosí</SelectItem>
                        <SelectItem value="chuquisaca">Chuquisaca</SelectItem>
                        <SelectItem value="tarija">Tarija</SelectItem>
                        <SelectItem value="beni">Beni</SelectItem>
                        <SelectItem value="pando">Pando</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="educationLevel">Grado de Formación</Label>
                <Select name="educationLevel" required>
                    <SelectTrigger id="educationLevel" className="bg-white border-gray-300">
                        <SelectValue placeholder="Seleccione el grado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                        <SelectItem value="licenciatura">Licenciatura</SelectItem>
                        <SelectItem value="diplomado">Diplomado</SelectItem>
                        <SelectItem value="especialidad">Especialidad</SelectItem>
                        <SelectItem value="maestria">Maestría</SelectItem>
                        <SelectItem value="doctorado">Doctorado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                <Label className="text-base font-medium">Locación</Label>
                <RadioGroup
                    name="location"
                    required
                    className="grid grid-cols-2 gap-4"
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                >
                    <div>
                        <RadioGroupItem value="ciudad" id="ciudad" className="peer sr-only" />
                        <Label
                            htmlFor="ciudad"
                            className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 cursor-pointer transition-all hover:border-[#3C8D50] hover:shadow-md ${selectedLocation === 'ciudad'
                                    ? 'border-[#0F3D33] bg-[#0F3D33]/5 shadow-md'
                                    : 'border-gray-300 bg-white'
                                }`}
                        >
                            <Building2
                                className={`w-10 h-10 mb-3 ${selectedLocation === 'ciudad' ? 'text-[#0F3D33]' : 'text-gray-500'
                                    }`}
                            />
                            <span className={`text-lg font-medium ${selectedLocation === 'ciudad' ? 'text-[#0F3D33]' : 'text-gray-700'
                                }`}>
                                Ciudad
                            </span>
                            <span className="text-sm text-gray-500 mt-1">Zona urbana</span>
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="campo" id="campo" className="peer sr-only" />
                        <Label
                            htmlFor="campo"
                            className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 cursor-pointer transition-all hover:border-[#3C8D50] hover:shadow-md ${selectedLocation === 'campo'
                                    ? 'border-[#0F3D33] bg-[#0F3D33]/5 shadow-md'
                                    : 'border-gray-300 bg-white'
                                }`}
                        >
                            <TreePine
                                className={`w-10 h-10 mb-3 ${selectedLocation === 'campo' ? 'text-[#3C8D50]' : 'text-gray-500'
                                    }`}
                            />
                            <span className={`text-lg font-medium ${selectedLocation === 'campo' ? 'text-[#0F3D33]' : 'text-gray-700'
                                }`}>
                                Campo
                            </span>
                            <span className="text-sm text-gray-500 mt-1">Zona rural</span>
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-2">
                <Label htmlFor="activityType">Tipo de Actividad</Label>
                <Select name="activityType" required>
                    <SelectTrigger id="activityType" className="bg-white border-gray-300">
                        <SelectValue placeholder="Seleccione el tipo de actividad" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="diseno">Diseño</SelectItem>
                        <SelectItem value="supervision">Supervisión</SelectItem>
                        <SelectItem value="avaluo">Avalúo</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
            >
                {isLoading ? 'Calculando...' : 'Calcular Arancel'}
            </Button>
        </form>
    );
}