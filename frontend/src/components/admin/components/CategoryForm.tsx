import { useState } from "react";
import { useForm } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Trash2, Save, FileText } from "lucide-react";
import { AddItemDialog } from "./AddItemDialog";
import { toast } from "sonner";

interface CategoryFormProps {
    category: any;
    onDeleteCategory: (id: string) => void;
    onAddNewItem: any;
    isDeletingCategory: boolean;
}

export const CategoryForm = ({ category, onDeleteCategory, onAddNewItem, isDeletingCategory }: CategoryFormProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSave, setIsLoadingSave] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    // Inicializamos el formulario con los niveles de esta categoría
    const { register, handleSubmit, getValues } = useForm({
        defaultValues: category
    });

    // Nota: Si los elementos dentro de niveles son dinámicos (puedes agregar/quitar)
    // se usaría useFieldArray, pero para edición directa la notación de puntos basta.

    const handlePrepareNewItem = async (data: any) => {
        const updatedCategory = getValues();
        const levelIndex = updatedCategory.niveles.findIndex(
            (n: any) => n.nombre === data.complexityLevel
        );

        const nuevoElemento = {
            detalle: data.itemName,
            valor: data.itemCost,
            unidad: data.itemUnit,
        };

        if (levelIndex !== -1) {
            updatedCategory.niveles[levelIndex].elementos.push(nuevoElemento);
        } else {
            updatedCategory.niveles.push({
                nombre: data.complexityLevel,
                elementos: [nuevoElemento]
            });
        }
        return await onAddNewItem({ catId: category.id, data: updatedCategory });
    };

    const handleSaveModifiedItem = async (data: any) => {
        try {
            setIsLoadingSave(true);
            await onAddNewItem({ catId: category.id, data: data });
        }
        catch (error) {
            toast.error("Error al actualizar la categoría");
        }
        finally {
            setIsLoadingSave(false);
        }
    };

    const handleRemoveItemAndSave = async (levelIdx: number, itemIdx: number) => {
        setIsDeleting(true);
        // 1. Obtenemos los datos actuales de los inputs
        const currentData = getValues();

        // 2. Eliminamos el elemento específico del array
        currentData.niveles[levelIdx].elementos.splice(itemIdx, 1);

        // 3. Opcional: Si el nivel se quedó sin elementos, ¿borramos el nivel?
        if (currentData.niveles[levelIdx].elementos.length === 0) {
            currentData.niveles.splice(levelIdx, 1);
        }

        // 4. Enviamos TODO al backend (esto disparará tu PATCH)
        try {
            await onAddNewItem({ catId: category.id, data: currentData });
        } catch (error) {
            toast.error("Error al eliminar el ítem");
        }
        setIsDeleting(false);
    };

    return (
        <div className="border-2 border-[#B0B0B0]/30 rounded-lg p-6 bg-white mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#0B3D2E]">{category.nombre}</h3>
                <div className="flex gap-2">
                    <AddItemDialog
                        category={category}
                        onAddItem={handlePrepareNewItem}
                        isOpen={isDialogOpen}
                        setIsOpen={setIsDialogOpen}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />
                    <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => (
                            onDeleteCategory(category.id)
                        )}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeletingCategory}
                    >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Eliminar Categoría
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit(handleSaveModifiedItem)}>

                {category.niveles.length === 0 || category.niveles[0].nombre === "" ? (
                    <div className="text-center py-8 text-gray-400">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No hay niveles de complejidad.</p>
                    </div>
                ) : (
                    <div className="space-y-6">

                        {category.niveles.map((complexity: any, levelIdx: number) => (
                            <div key={complexity.id || levelIdx} className="border border-[#B0B0B0]/20 rounded-md p-4 bg-[#F2F2F2]/50">
                                <h4 className="font-semibold text-[#1B5E3A] mb-3">
                                    Nivel: {complexity.nombre}
                                </h4>

                                <input type="hidden" {...register(`niveles.${levelIdx}.nombre`)} />

                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-white/50">
                                            <TableHead className="text-[#0B3D2E]">Nombre del Trabajo</TableHead>
                                            <TableHead className="text-[#0B3D2E] text-right">Valor</TableHead>
                                            <TableHead className="text-[#0B3D2E] text-right">Unidad</TableHead>
                                            <TableHead className="text-[#0B3D2E] text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {complexity.elementos.map((item: any, itemIdx: number) => (
                                            <TableRow key={item.id || itemIdx}>
                                                <TableCell>
                                                    <Input
                                                        {...register(`niveles.${levelIdx}.elementos.${itemIdx}.detalle`)}
                                                        className="bg-white"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        {...register(`niveles.${levelIdx}.elementos.${itemIdx}.valor`, { valueAsNumber: true })}
                                                        className="max-w-[150px] ml-auto bg-white"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Input
                                                        {...register(`niveles.${levelIdx}.elementos.${itemIdx}.unidad`)}
                                                        className="max-w-[120px] ml-auto bg-white"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        type="button"
                                                        onClick={() => {
                                                            if (confirm("¿Eliminar este ítem?")) {
                                                                handleRemoveItemAndSave(levelIdx, itemIdx);
                                                            }
                                                        }}
                                                        className="bg-red-600 hover:bg-red-700"
                                                        disabled={isDeleting}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-[#B0B0B0]/30 flex justify-end">
                    <Button type="submit" className="bg-[#0B3D2E] hover:bg-[#1B5E3A]" size="sm" disabled={isLoadingSave}>
                        <Save className="w-3 h-3 mr-2" />
                        {isLoadingSave ? "Guardando..." : `Guardar ${category.nombre}`}
                    </Button>
                </div>
            </form>
        </div>
    );
};