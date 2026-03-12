import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculatorSchema,
  type FormData,
} from "../validations/CalculatorSchema";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Building2, TreePine, Loader2 } from "lucide-react";
import { useCalculatorData } from "../hooks/useCalculatorData";

interface CalculatorFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export function CalculatorForm({ onSubmit, isLoading }: CalculatorFormProps) {
  const { actividades, educationLevels, isLoadingData } = useCalculatorData();

  // 6. Lista de departamentos corregida con mayúsculas (Nombre propio)
  const departamentos = [
    "Beni",
    "Chuquisaca",
    "Cochabamba",
    "La Paz",
    "Oruro",
    "Pando",
    "Potosí",
    "Santa Cruz",
    "Tarija",
  ];

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      yearsOfExperience: 0,
      department: "",
      educationLevel: "",
      location: "ciudad",
      activityType: "",
    },
  });

  const selectedLocation = watch("location");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="yearsOfExperience">Años de Antigüedad</Label>
        <Input
          id="yearsOfExperience"
          type="number"
          className={errors.yearsOfExperience ? "border-red-500" : "bg-white"}
          {...register("yearsOfExperience", { valueAsNumber: true })}
        />
        {errors.yearsOfExperience && (
          <p className="text-xs text-red-500 font-medium">
            {errors.yearsOfExperience.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Departamento</Label>
        <Controller
          name="department"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger
                className={
                  errors.department ? "border-red-500 bg-white" : "bg-white"
                }
              >
                <SelectValue placeholder="Seleccione el departamento" />
              </SelectTrigger>
              <SelectContent>
                {departamentos.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.department && (
          <p className="text-xs text-red-500 font-medium">
            {errors.department.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Grado de Formación</Label>
        <Controller
          name="educationLevel"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger
                className={
                  errors.educationLevel ? "border-red-500 bg-white" : "bg-white"
                }
              >
                <SelectValue
                  placeholder={
                    isLoadingData ? "Cargando..." : "Seleccione el grado"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((grado: any) => (
                  <SelectItem key={grado.value} value={grado.value}>
                    {grado.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.educationLevel && (
          <p className="text-xs text-red-500 font-medium">
            {errors.educationLevel.message}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">Locación</Label>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="ciudad"
                  id="ciudad"
                  className="sr-only"
                />
                <Label
                  htmlFor="ciudad"
                  className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedLocation === "ciudad"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <Building2
                    className={`w-8 h-8 mb-2 ${selectedLocation === "ciudad" ? "text-primary" : "text-gray-400"}`}
                  />
                  <span className="font-medium">Ciudad</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="campo" id="campo" className="sr-only" />
                <Label
                  htmlFor="campo"
                  className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedLocation === "campo"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <TreePine
                    className={`w-8 h-8 mb-2 ${selectedLocation === "campo" ? "text-primary" : "text-gray-400"}`}
                  />
                  <span className="font-medium">Campo</span>
                </Label>
              </div>
            </RadioGroup>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label>Tipo de Actividad</Label>
        <Controller
          name="activityType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger
                className={
                  errors.activityType ? "border-red-500 bg-white" : "bg-white"
                }
              >
                <SelectValue
                  placeholder={
                    isLoadingData ? "Cargando..." : "Seleccione actividad"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {actividades.map((act: any) => (
                  <SelectItem key={act.value} value={act.value}>
                    {act.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.activityType && (
          <p className="text-xs text-red-500 font-medium">
            {errors.activityType.message}
          </p>
        )}
      </div>

      {/* 7. Botón con estado dinámico de carga */}
      <Button
        type="submit"
        className="w-full text-base font-semibold"
        disabled={isLoading || isLoadingData}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Cargando...
          </div>
        ) : (
          "Calcular Arancel"
        )}
      </Button>
    </form>
  );
}
