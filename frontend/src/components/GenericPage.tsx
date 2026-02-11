import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { FileText, BookOpen, Bell, Calendar, Search } from "lucide-react";
import { useItems } from "../hooks/useItems";
import type { GenericData } from "../validations/genericSchema";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { useDebounce } from "use-debounce";

interface GenericPageProps {
  title: string;
  description: string;
  type: 'yearbooks' | 'regulation' | 'announcements';
}

export function GenericPage({ title, description, type }: GenericPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, category]);
  const { items, isPending, error, next, previous, count } = useItems(type, page, debouncedSearchTerm, category);
  const pageSize = 20;
  const totalPages = count ? Math.ceil(count / pageSize) : 1;
  console.log(`Loaded ${type}:`, items);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Hubo un error al cargar los datos.</p>
      </div>
    );
  }

  const getIcon = () => {
    switch (type) {
      case 'yearbooks':
        return BookOpen;
      case 'regulation':
        return FileText;
      case 'announcements':
        return Bell;
      default:
        return FileText;
    }
  };

  const Icon = getIcon();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reglamento': return 'bg-blue-100 text-blue-800';
      case 'estatuto': return 'bg-green-100 text-green-800';
      case "ley": return 'bg-purple-100 text-purple-800';
      case "decreto": return 'bg-yellow-100 text-yellow-800';
      case "resolucion": return 'bg-red-100 text-red-800';
      case "documentacion junta": return 'bg-indigo-100 text-indigo-800';
      case "documentacion directorio": return 'bg-pink-100 text-pink-800';
      case "otro": return 'bg-gray-100 text-gray-800';
      default: return 'bg-secondary/10 text-secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-3">
            <Icon className="w-10 h-10 mr-4" />
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
          <p className="text-lg">{description}</p>
        </div>
      </div>

      {type === 'regulation' && (
        <div className="bg-muted py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar normativas..."
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
                  <SelectItem value="reglamento">Reglamento</SelectItem>
                  <SelectItem value="estatuto">Estatuto</SelectItem>
                  <SelectItem value="ley">Ley</SelectItem>
                  <SelectItem value="decreto">Decreto</SelectItem>
                  <SelectItem value="resolucion">Resolución</SelectItem>
                  <SelectItem value="documentacion junta">Documentación Junta</SelectItem>
                  <SelectItem value="documentacion directorio">Documentación Directorio</SelectItem>
                  <SelectItem value="otro">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      <div className="text-muted-foreground mt-4 max-w-7xl mx-auto px-4">
        Mostrando {1 + (page - 1) * pageSize}-{Math.min(page * pageSize, count)} de {count} {type === 'regulation' ? 'normativas' : type === 'yearbooks' ? 'anuarios' : 'convocatorias'}
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isPending ? (
          <p>Cargando información...</p>
        ) : (
          items.map((item: GenericData) => (
            <a key={item.id} href={item.pdf_url} target="_blank" rel="noreferrer" className="no-underline">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{item.nombre}</CardTitle>
                </CardHeader>
                <CardContent>
                  {type === 'regulation' && item.categoria && (
                    <span className={`inline-block ${getCategoryColor(item.categoria)} px-2 py-1 rounded-full text-sm mb-2 capitalize`}>
                      {item.categoria}
                    </span>
                  )}
                  <CardDescription>{item.descripcion}</CardDescription>
                  <span className="text-blue-500 underline mt-2 block">
                    Ver PDF
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Fecha de Publicación: {new Date(item.fecha_publicacion).toLocaleDateString('es-BO')}
                  </span>
                </CardContent>
              </Card>
            </a>
          ))
        )}
      </div>
      {items.length > 0 && (
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
      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron elementos que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  );
}