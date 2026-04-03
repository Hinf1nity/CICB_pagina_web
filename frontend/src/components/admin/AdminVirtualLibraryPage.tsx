import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
    FileText,
    Plus,
    Edit,
    Trash2,
    Search,
    Calendar,
    Download,
    ArrowLeft,
    CheckCircle2,
    Upload,
    X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { type VirtualDocument, virtualLibrarySchema } from '../../validations/virtualLibrarySchema';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useVirtualLibraryAdmin, useVirtualLibraryPost, useVirtualLibraryPatch, useVirtualLibraryDelete, useVirtualLibraryDetailAdmin } from '../../hooks/useVirtualLibrary';
import { useDebounce } from 'use-debounce';

export function AdminVirtualLibraryPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<VirtualDocument | null>(null);
    const [page, setPage] = useState(1);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    useEffect(() => {
        setPage(1);
    }, [debouncedSearchTerm, category]);
    const { data, count, published_count, draft_count, archived_count, next, previous } = useVirtualLibraryAdmin(page, debouncedSearchTerm, category);
    const pageSize = 20;
    const totalPages = count ? Math.ceil(count / pageSize) : 1;
    const { mutate: postItem, isPending: isPosting } = useVirtualLibraryPost();
    const { mutate: patchItem, isPending: isPatching } = useVirtualLibraryPatch();
    const { mutate: deleteItem } = useVirtualLibraryDelete();
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<VirtualDocument>(
        {
            resolver: zodResolver(virtualLibrarySchema),
            defaultValues: {
                titulo: '',
                autor: '',
                descripcion: '',
                anio: '',
                pdf: undefined,
                categoria: 'otros',
                estado: 'borrador',
            }
        }
    );

    const handleCreate = () => {
        reset({
            titulo: '',
            autor: '',
            descripcion: '',
            anio: '',
            pdf: undefined,
            categoria: 'otros',
            estado: 'borrador',
        })
        setEditingItem(null);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este documento?')) {
            deleteItem(id);
        }
    };

    const handleEdit = async (document: VirtualDocument) => {
        const data = await useVirtualLibraryDetailAdmin(document.id!);
        reset({
            ...document,
            anio: document.anio,
            pdf: data?.pdf,
            pdf_url: data?.pdf_url,
        });
        setEditingItem({
            ...document,
            anio: document.anio,
            pdf: data?.pdf,
            pdf_url: data?.pdf_url,
        });
        setIsDialogOpen(true);
    };

    const handleSave: SubmitHandler<VirtualDocument> = (data) => {
        if (editingItem && editingItem.id !== undefined) {
            patchItem({ id: editingItem.id, data, data_old: editingItem }, {
                onSuccess: () => {
                    setEditingItem(null);
                    setIsDialogOpen(false);
                    reset();
                }
            });
        } else {
            postItem(data, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                }
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'publicado': return 'bg-[#3C8D50] text-white';
            case 'borrador': return 'bg-yellow-500 text-white';
            case 'archivado': return 'bg-gray-500 text-white';
            default: return '';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'publicado': return 'Publicado';
            case 'borrador': return 'Borrador';
            case 'archivado': return 'Archivado';
            default: return status;
        }
    };
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Ingeniería Estructural': return 'bg-blue-100 text-blue-800';
            case 'Ingeniería Hidráulica': return 'bg-green-100 text-green-800';
            case "Ingeniería Sanitaria": return 'bg-purple-100 text-purple-800';
            case "Vias y Transporte": return 'bg-yellow-100 text-yellow-800';
            case "Ingeniería Geotécnica": return 'bg-red-100 text-red-800';
            case "Gerencias de la Construcción": return 'bg-indigo-100 text-indigo-800';
            case "otros": return 'bg-gray-100 text-gray-800';
            default: return 'bg-secondary/10 text-secondary';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-primary text-primary-foreground py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/admin')}
                        className="mb-4 text-primary-foreground hover:bg-primary-foreground/10"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Panel
                    </Button>
                    <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-10 h-10" />
                        <h1 className="text-3xl font-bold mb-3">Gestión de Biblioteca Virtual</h1>
                    </div>
                    <p>Administra documentos, manuales, normativas y recursos técnicos de la biblioteca</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Actions Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Buscar documentos por título o año..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            <SelectItem value="Ingeniería Estructural">Ingeniería Estructural</SelectItem>
                            <SelectItem value="Ingeniería Hidráulica">Ingeniería Hidráulica</SelectItem>
                            <SelectItem value="Ingeniería Sanitaria">Ingeniería Sanitaria</SelectItem>
                            <SelectItem value="Vias y Transporte">Vias y Transporte</SelectItem>
                            <SelectItem value="Ingeniería Geotécnica">Ingeniería Geotécnica</SelectItem>
                            <SelectItem value="Gerencias de la Construcción">Gerencias de la Construcción</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        className="bg-primary text-primary-foreground"
                        onClick={handleCreate}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Documento
                    </Button>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <form onSubmit={handleSubmit(handleSave)}>
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingItem ? 'Editar Documento' : 'Crear Nuevo Documento'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingItem
                                            ? 'Actualiza la información del documento'
                                            : 'Completa la información para crear un nuevo documento'}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="titulo">Título<span className="text-red-500">*</span></Label>
                                        <Input
                                            id="titulo"
                                            placeholder="Título del documento..."
                                            {...register("titulo")}
                                        />
                                        {errors.titulo && (
                                            <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                                <AlertTitle className='text-sm'>Error en el Título</AlertTitle>
                                                <AlertDescription className='text-xs'>{errors.titulo?.message}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="autor">Autor<span className="text-red-500">*</span></Label>
                                        <Input
                                            id="autor"
                                            placeholder="Autor del documento..."
                                            {...register("autor")}
                                        />
                                        {errors.autor && (
                                            <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                                <AlertTitle className='text-sm'>Error en el Autor</AlertTitle>
                                                <AlertDescription className='text-xs'>{errors.autor?.message}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="descripcion">Descripción<span className="text-red-500">*</span></Label>
                                        <Textarea
                                            id="descripcion"
                                            placeholder="Descripción detallada del documento..."
                                            rows={4}
                                            {...register("descripcion")}
                                        />
                                        {errors.descripcion && (
                                            <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                                <AlertTitle className='text-sm'>Error en la Descripción</AlertTitle>
                                                <AlertDescription className='text-xs'>{errors.descripcion?.message}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="categoria">Categoría<span className="text-red-500">*</span></Label>
                                            <Controller
                                                control={control}
                                                name="categoria"
                                                render={({ field }) => (
                                                    <>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Ingeniería Estructural">Ingeniería Estructural</SelectItem>
                                                                <SelectItem value="Ingeniería Hidráulica">Ingeniería Hidráulica</SelectItem>
                                                                <SelectItem value="Ingeniería Sanitaria">Ingeniería Sanitaria</SelectItem>
                                                                <SelectItem value="Vias y Transporte">Vias y Transporte</SelectItem>
                                                                <SelectItem value="Ingeniería Geotécnica">Ingeniería Geotécnica</SelectItem>
                                                                <SelectItem value="Gerencias de la Construcción">Gerencias de la Construcción</SelectItem>
                                                                <SelectItem value="otros">Otros</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.categoria && (
                                                            <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                                                <AlertTitle className='text-sm'>Error en la Categoría</AlertTitle>
                                                                <AlertDescription className='text-xs'>{errors.categoria?.message}</AlertDescription>
                                                            </Alert>
                                                        )}
                                                    </>
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="estado">Estado<span className="text-red-500">*</span></Label>
                                            <Controller
                                                control={control}
                                                name="estado"
                                                render={({ field }) => (
                                                    <>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="borrador">Borrador</SelectItem>
                                                                <SelectItem value="publicado">Publicado</SelectItem>
                                                                <SelectItem value="archivado">Archivado</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.estado && (
                                                            <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                                                <AlertTitle className='text-sm'>Error en el Estado</AlertTitle>
                                                                <AlertDescription className='text-xs'>{errors.estado?.message}</AlertDescription>
                                                            </Alert>
                                                        )}
                                                    </>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="anio">Año de Publicación<span className="text-red-500">*</span></Label>
                                            <Input
                                                id="anio"
                                                placeholder='Año de Publicación (YYYY)...'
                                                {...register("anio")}
                                            />
                                            {errors.anio && (
                                                <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                                    <AlertTitle className='text-sm'>Error en el Año de Publicación</AlertTitle>
                                                    <AlertDescription className='text-xs'>{errors.anio?.message}</AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    </div>
                                    <Controller
                                        name="pdf"
                                        control={control}
                                        render={({ field }) => {
                                            const file = field.value;

                                            const isFile = file instanceof File;
                                            const isUrl = typeof file === 'string' && file.startsWith('http');

                                            const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                                const newFile = e.target.files?.[0];
                                                if (!newFile) return;

                                                if (newFile.type !== "application/pdf") {
                                                    alert("Solo se permiten archivos PDF");
                                                    return;
                                                }
                                                if (newFile.size > 200 * 1024 * 1024) {
                                                    alert("El PDF no debe superar los 200MB");
                                                    return;
                                                }

                                                field.onChange(newFile); // ⬅️ actualiza React Hook Form
                                            };

                                            const removePdf = () => {
                                                field.onChange(null); // limpia el valor en el form
                                            };

                                            return (
                                                <div className="space-y-2">
                                                    <Label htmlFor="pdf">Documento PDF<span className="text-red-500">*</span></Label>
                                                    {isUrl && (
                                                        <div className="flex items-center justify-between p-3 border border-input rounded-md bg-muted/50">
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="w-5 h-5 text-destructive" />
                                                                <a href={file} target="_blank" rel="noopener noreferrer" className="text-foreground underline">
                                                                    Ver documento actual
                                                                </a>
                                                            </div>
                                                            <Button type="button" variant="ghost" size="sm" onClick={removePdf}>
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {isFile && (
                                                        <div className="flex items-center justify-between p-3 border border-input rounded-md bg-muted/50">
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="w-5 h-5 text-destructive" />
                                                                <span className="text-foreground">{file.name}</span>
                                                                <span className="text-muted-foreground">
                                                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                                </span>
                                                            </div>
                                                            <Button type="button" variant="ghost" size="sm" onClick={removePdf}>
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {!isFile && !isUrl && (
                                                        <div className="border-2 border-dashed border-input rounded-md p-4 text-center hover:border-primary transition-colors">
                                                            <input
                                                                type="file"
                                                                id="pdf"
                                                                accept=".pdf"
                                                                onChange={handlePdfChange}
                                                                className="hidden"
                                                            />
                                                            <label htmlFor="pdf" className="cursor-pointer">
                                                                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                                                <p className="text-muted-foreground">
                                                                    Sube un PDF con detalles adicionales (máx. 200MB)
                                                                </p>
                                                            </label>
                                                        </div>
                                                    )}
                                                    {errors.pdf && (
                                                        <Alert variant="destructive" className="text-xs px-2 py-1 [&>svg]:size-3">
                                                            <AlertTitle className='text-sm'>Error en el PDF</AlertTitle>
                                                            <AlertDescription className='text-xs'>{errors.pdf?.message}</AlertDescription>
                                                        </Alert>
                                                    )}
                                                </div>
                                            );
                                        }}
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type='submit' disabled={isPosting || isPatching} className="bg-primary text-primary-foreground">
                                        {editingItem ? (isPatching ? 'Actualizando...' : 'Actualizar Normativa') : (isPosting ? 'Guardando...' : 'Guardar Normativa')}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground mb-1">Total Documentos</p>
                                    <p className="text-3xl">{count}</p>
                                </div>
                                <FileText className="w-8 h-8 text-[#0B3D2E]" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground mb-1">Publicados</p>
                                    <p className="text-3xl">
                                        {published_count}
                                    </p>
                                </div>
                                <CheckCircle2 className="w-8 h-8 text-[#3C8D50]" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground mb-1">Borradores</p>
                                    <p className="text-3xl">
                                        {draft_count}
                                    </p>
                                </div>
                                <Edit className="w-8 h-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground mb-1">Archivados</p>
                                    <p className="text-3xl">
                                        {archived_count}
                                    </p>
                                </div>
                                <Calendar className="w-8 h-8 text-gray-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Regulations List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Normativas Registradas</CardTitle>
                        <CardDescription>
                            Mostrando {1 + (page - 1) * pageSize}-{Math.min(page * pageSize, count)} de {count} documentos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.map((document) => (
                                <div
                                    key={document.id}
                                    className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="text-foreground">{document.titulo}</h3>
                                                <Badge className={getStatusColor(document.estado)}>
                                                    {getStatusLabel(document.estado)}
                                                </Badge>
                                                <Badge className={`${getCategoryColor(document.categoria || '')} capitalize`}>
                                                    {document.categoria || 'sin categoría'}
                                                </Badge>
                                            </div>

                                            <p className="text-muted-foreground mb-3">{document.descripcion}</p>

                                            <div className="flex flex-wrap gap-4 text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    Publicación: {document.anio}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {document.pdf_url && (
                                                <Button variant="outline" size="sm">
                                                    <Download className="w-4 h-4 mr-2" />
                                                    PDF
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit({ ...document, pdf: document.pdf_url ?? '' })}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => document.id !== undefined && handleDelete(document.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* creamos la paginacion y sus flechas */}
                            {data.length > 0 && (
                                <div className="flex items-center justify-center gap-4 mt-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!previous}
                                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                    >
                                        Anterior
                                    </Button>

                                    <span className="text-sm text-muted-foreground">
                                        Página {page} de {totalPages}
                                    </span>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!next}
                                        onClick={() => setPage((p) => p + 1)}
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            )}

                            {data.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No se encontraron documentos</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}