import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { FileText, Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { CategoryForm } from "./CategoryForm";
import { useAdminCategoriasPost, useAdminCategoriasPatch, useAdminCategoriasDelete } from "../../../hooks/useAdminAranceles";
import { useForm, useFieldArray } from "react-hook-form";

export function WorkCostsSection({ aranceles }: { aranceles: any[] }) {
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { mutate: postCategoria } = useAdminCategoriasPost();
    const { mutateAsync: addItemToCategoria } = useAdminCategoriasPatch();
    const { mutate: deleteCategoria } = useAdminCategoriasDelete();
    const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            nombre: "",
            niveles: [{ nombre: "", elementos: [{ detalle: "", valor: 0, unidad: "" }] }]
        }
    });

    const { fields } = useFieldArray({ control, name: "niveles" });

    const handleAddCategory = (data: any) => {
        setIsLoading(true);
        postCategoria(data, {
            onSuccess: () => {
                setIsAddCategoryOpen(false);
                reset()
            }
        });
        setIsLoading(false);
    };

    return (
        <Card className="border-[#B0B0B0]/30">
            <CardHeader className="bg-[#0B3D2E]/5">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-[#0B3D2E]">Costos por Trabajo Desarrollado</CardTitle>
                        <CardDescription>Gestione categorías, niveles de complejidad y costos base</CardDescription>
                    </div>

                    <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#1B5E3A] hover:bg-[#0B3D2E]">
                                <Plus className="w-4 h-4 mr-2" />
                                Nueva Categoría
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={handleSubmit(handleAddCategory)}>
                                <DialogHeader>
                                    <DialogTitle>Agregar Nueva Categoría</DialogTitle>
                                    <DialogDescription>Cree una nueva categoría de trabajos (ej: ESTRUCTURAS).</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="categoryName">Nombre de la Categoría<span className="text-red-500">*</span></Label>
                                        <Input
                                            id="categoryName"
                                            placeholder="Ej: VÍAS Y CAMINOS"
                                            {...register("nombre", { required: "El nombre es obligatorio" })}
                                        />
                                        {errors.nombre && (
                                            <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                                <AlertTitle className='text-sm'>Error en el Nombre de la Categoría</AlertTitle>
                                                <AlertDescription className='text-xs'>{errors.nombre?.message}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="hidden">
                                            <input type="hidden" {...register(`niveles.${index}.nombre`)} />
                                            {field.elementos?.map((_, itemIdx) => (
                                                <div key={itemIdx}>
                                                    <input type="hidden" {...register(`niveles.${index}.elementos.${itemIdx}.detalle`)} />
                                                    <input type="hidden" {...register(`niveles.${index}.elementos.${itemIdx}.valor`, { valueAsNumber: true })} />
                                                    <input type="hidden" {...register(`niveles.${index}.elementos.${itemIdx}.unidad`)} />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isLoading} className="bg-[#0B3D2E] hover:bg-[#1B5E3A]">
                                        {isLoading ? "Creando..." : "Crear Categoría"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                <div className="space-y-4">
                    {aranceles?.map((category) => (
                        <CategoryForm
                            key={category.id}
                            category={category}
                            onDeleteCategory={(id) => deleteCategoria(parseInt(id))}
                            onAddNewItem={addItemToCategoria}
                        />
                    ))}

                    {(!aranceles || aranceles.length === 0) && (
                        <div className="text-center py-12 text-gray-400">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg mb-2">No hay categorías de trabajo configuradas</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}