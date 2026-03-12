import { useForm, Controller } from "react-hook-form";
import { Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger
} from "../../ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "../../ui/select";
import { toast } from "sonner";

interface AddItemDialogProps {
    category: any;
    onAddItem: any;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isLoading: boolean;
    setIsLoading: (open: boolean) => void;
}

type ItemFormValues = {
    categoryId: string;
    complexityLevel: string;
    itemName: string;
    itemCost: number;
    itemUnit: string;
};

export function AddItemDialog({ category, onAddItem, isOpen, setIsOpen, isLoading, setIsLoading }: AddItemDialogProps) {

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ItemFormValues>({
        defaultValues: {
            categoryId: category.id,
            complexityLevel: "sin nivel",
            itemName: "",
            itemCost: 0,
            itemUnit: ""
        }
    });

    const onSubmit = async (data: ItemFormValues) => {
        try {
            setIsLoading(true);
            await onAddItem(data); // Enviamos los datos al padre
            setIsOpen(false); // Cerramos el diálogo después de guardar
            reset();         // Limpiamos el formulario
        } catch (error) {
            toast.error("Error al agregar el ítem");
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    className="bg-[#3C8D50] hover:bg-[#1B5E3A]"
                >
                    <Plus className="w-3 h-3 mr-1" />
                    Ítem
                </Button>
            </DialogTrigger>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Agregar Ítem de Trabajo</DialogTitle>
                        <DialogDescription>
                            Agregue un nuevo trabajo a la categoría <strong>{category.nombre}</strong>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <input hidden {...register("categoryId", { valueAsNumber: true })} /> {/* Para saber a qué categoría pertenece el nuevo ítem */}
                        {/* SELECT CON CONTROLLER */}
                        <div className="space-y-2">
                            <Label>Nivel de Complejidad</Label>
                            <Controller
                                name="complexityLevel"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione nivel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sin nivel">Sin Nivel</SelectItem>
                                            <SelectItem value="Básica">Básica</SelectItem>
                                            <SelectItem value="Simples">Simples</SelectItem>
                                            <SelectItem value="Medianas">Medianas</SelectItem>
                                            <SelectItem value="Medianamente compleja">Medianamente compleja</SelectItem>
                                            <SelectItem value="Compleja">Compleja</SelectItem>
                                            <SelectItem value="Especiales">Especiales</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        {/* INPUT NOMBRE */}
                        <div className="space-y-2">
                            <Label htmlFor="itemName">Nombre del Trabajo</Label>
                            <Input
                                id="itemName"
                                placeholder="Ej: Diseño estructural vivienda"
                                {...register("itemName", { required: "El nombre es obligatorio" })}
                            />
                            {errors.itemName && (
                                <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                    <AlertTitle className='text-sm'>Error en el Nombre del Item</AlertTitle>
                                    <AlertDescription className='text-xs'>{errors.itemName?.message}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* INPUT COSTO */}
                            <div className="space-y-2">
                                <Label htmlFor="itemCost">Valor</Label>
                                <Input
                                    id="itemCost"
                                    type="number"
                                    step="0.01"
                                    placeholder="Ej: 0.01"
                                    {...register("itemCost", {
                                        required: true,
                                        valueAsNumber: true,
                                        min: { value: 0, message: "El costo debe ser mayor a 0" }
                                    })}
                                />
                                {errors.itemCost && (
                                    <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                        <AlertTitle className='text-sm'>Error en el Costo del Item</AlertTitle>
                                        <AlertDescription className='text-xs'>{errors.itemCost?.message}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* INPUT UNIDAD */}
                            <div className="space-y-2">
                                <Label htmlFor="itemUnit">Unidad</Label>
                                <Input
                                    id="itemUnit"
                                    placeholder="Ej: m2"
                                    {...register("itemUnit", {
                                        required: true,
                                        validate: value => value.trim() !== "" || "La unidad es obligatoria"
                                    })}
                                />
                                {errors.itemUnit && (
                                    <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                        <AlertTitle className='text-sm'>Error en la Unidad del Item</AlertTitle>
                                        <AlertDescription className='text-xs'>{errors.itemUnit?.message}</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            className="bg-[#0B3D2E] hover:bg-[#1B5E3A]"
                            disabled={isLoading}
                        >
                            {isLoading ? "Agregando..." : "Agregar Ítem"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}