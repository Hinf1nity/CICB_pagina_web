import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { FileText, BookOpen, Bell, Calendar } from "lucide-react";
import { useItems } from "../hooks/useItems";
import type { GenericData } from "../validations/genericSchema";
import { useState } from "react";
import { Button } from "./ui/button";

interface GenericPageProps {
  title: string;
  description: string;
  type: 'yearbooks' | 'regulation' | 'announcements';
}

export function GenericPage({ title, description, type }: GenericPageProps) {
  const [page, setPage] = useState(1);
  const { items, isPending, isError, error, next, previous, count } = useItems(type, page);
  const pageSize = 20;
  const totalPages = count ? Math.ceil(count / pageSize) : 1;
  console.log(`Loaded ${type}:`, items);

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
      {!isPending && (
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