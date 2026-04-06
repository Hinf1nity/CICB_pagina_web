import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
    Search,
    BookOpen,
    Download,
    Eye,
    LayoutGrid,
    List,
    FileText,
    Filter,
    X,
} from 'lucide-react';
import type { VirtualDocument } from '../validations/virtualLibrarySchema';
import { useVirtualLibrary } from '../hooks/useVirtualLibrary';
import { useDebounce } from 'use-debounce';

const CATEGORIES = [
    'Todas las categorías',
    "Ingeniería Estructural",
    "Ingeniería Hidráulica",
    "Ingeniería Sanitaria",
    "Vias y Transporte",
    "Ingeniería Geotécnica",
    "Gerencias de la Construcción",
    "otros",
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    'Ingeniería Estructural': { bg: 'bg-[#0B3D2E]/10', text: 'text-[#0B3D2E]' },
    'Ingeniería Hidráulica': { bg: 'bg-[#1B5E3A]/10', text: 'text-[#1B5E3A]' },
    'Ingeniería Sanitaria': { bg: 'bg-[#3A5A78]/10', text: 'text-[#3A5A78]' },
    'Vias y Transporte': { bg: 'bg-amber-100', text: 'text-amber-800' },
    'Ingeniería Geotécnica': { bg: 'bg-sky-100', text: 'text-sky-800' },
    'Gerencias de la Construcción': { bg: 'bg-purple-100', text: 'text-purple-800' },
    'otros': { bg: 'bg-muted', text: 'text-foreground' },
};

function getCategoryColor(cat: string) {
    return CATEGORY_COLORS[cat] ?? { bg: 'bg-muted', text: 'text-foreground' };
}

type ViewMode = 'grid' | 'list';

type VirtualLibraryDisplayDocument = Omit<VirtualDocument, 'pdf' | 'pdf_url'> & {
    pdf?: string | File;
    pdf_url?: string;
};

export function VirtualLibraryPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas las categorías');
    const [debouncedSearchTerm] = useDebounce(search, 500);
    const [page, setPage] = useState(1);
    useEffect(() => {
        setPage(1);
    }, [debouncedSearchTerm, selectedCategory]);
    const { data, isPending, error, next, previous, count } = useVirtualLibrary(page, debouncedSearchTerm, selectedCategory === 'Todas las categorías' ? 'all' : selectedCategory);
    const pageSize = 20;
    const totalPages = count ? Math.ceil(count / pageSize) : 1;

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('Todas las categorías');
    };

    const hasFilters = search.trim() !== '' || selectedCategory !== 'Todas las categorías';
    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Hubo un error al cargar los datos.</p>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-background">

            {/* ── Header ── */}
            <div className="bg-primary text-primary-foreground py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center mb-3">
                        <BookOpen className="w-10 h-10 mr-4 shrink-0" />
                        <h1>Biblioteca Virtual</h1>
                    </div>
                    <p>
                        Accede a normativas, manuales técnicos, códigos de construcción y documentos de referencia
                        para la práctica profesional de la ingeniería civil en Bolivia.
                    </p>
                </div>
            </div>

            {/* ── Filters ── */}
            <div className="bg-muted border-b border-border sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Buscar por nombre, autor o etiqueta…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-background"
                            />
                        </div>

                        {/* Category select */}
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full sm:w-64 bg-background capitalize">
                                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem className="capitalize" key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* View toggle */}
                        <div className="flex items-center gap-1 bg-background border border-border rounded-md p-1 shrink-0">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Vista cuadrícula"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Vista lista"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Results count + clear */}
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-muted-foreground">
                            Mostrando {1 + (page - 1) * pageSize}-{Math.min(page * pageSize, count)} de {count} resultados
                        </p>
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-sm text-[#1B5E3A] hover:text-[#0B3D2E] transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Document list / grid ── */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {isPending ? (
                    <p>Cargando información...</p>
                ) : data.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">No se encontraron documentos con esos criterios.</p>
                        <button onClick={clearFilters} className="mt-3 text-sm text-[#1B5E3A] hover:underline">
                            Limpiar filtros
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {data.map((doc) => (
                            <GridCard key={doc.id} doc={doc} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {data.map((doc) => (
                            <ListRow key={doc.id} doc={doc} />
                        ))}
                    </div>
                )}
            </div>
            {data.length > 0 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                    {/* creamos la paginacion y sus flechas */}
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
        </div>
    );
}

/* ── Grid card ─────────────────────────────────────────────────────────────── */
function GridCard({ doc }: { doc: VirtualLibraryDisplayDocument }) {
    const { bg, text } = getCategoryColor(doc.categoria);
    const pdfUrl = typeof doc.pdf_url === 'string' ? doc.pdf_url : undefined;
    return (
        <Card className="flex flex-col hover:shadow-lg transition-shadow group border-border">
            {/* Top accent strip */}
            <div className="h-1.5 rounded-t-lg bg-[#1B5E3A]" />

            <CardHeader className="pb-2">
                {/* Category badge */}
                <span className={`inline-flex items-center self-start px-2 py-0.5 rounded text-xs mb-2 ${bg} ${text}`}>
                    {doc.categoria}
                </span>
                <CardTitle className="leading-snug">{doc.titulo}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col flex-1 gap-3">
                <CardDescription className="line-clamp-3">{doc.descripcion}</CardDescription>

                {/* Meta */}
                <div className="text-xs text-muted-foreground space-y-1 mt-auto">
                    <div className="flex justify-between">
                        <span>{doc.autor}</span>
                        <span>{doc.anio}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                    {pdfUrl ? (
                        <Button asChild variant="outline" size="sm" className="flex-1 gap-1.5">
                            <a href={pdfUrl} target="_blank" rel="noreferrer">
                                <Eye className="w-3.5 h-3.5" />
                                Ver
                            </a>
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" className="flex-1 gap-1.5" disabled>
                            <Eye className="w-3.5 h-3.5" />
                            Ver
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

/* ── List row ───────────────────────────────────────────────────────────────── */
function ListRow({ doc }: { doc: VirtualLibraryDisplayDocument }) {
    const { bg, text } = getCategoryColor(doc.categoria);
    return (
        <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 items-start">
            {/* Icon */}
            <div className="shrink-0 w-11 h-11 rounded-lg bg-[#0B3D2E]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#0B3D2E]" />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
                        {doc.categoria}
                    </span>
                    <span className="text-xs text-muted-foreground">{doc.anio}</span>
                </div>
                <p className="leading-snug mb-1">{doc.titulo}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{doc.descripcion}</p>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{doc.autor}</span>
                    <span>·</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col gap-2 shrink-0">
                <Button variant="outline" size="sm" className="gap-1.5 w-full">
                    <Eye className="w-3.5 h-3.5" />
                    Ver
                </Button>
                <Button size="sm" className="gap-1.5 w-full bg-[#0B3D2E] hover:bg-[#1B5E3A] text-white">
                    <Download className="w-3.5 h-3.5" />
                    PDF
                </Button>
            </div>
        </div>
    );
}
