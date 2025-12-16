import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { FileText, BookOpen, Bell, Calendar } from "lucide-react";
import { useItems } from "../hooks/useItems";
import type { GenericData } from "../validations/genericSchema";

interface GenericPageProps {
  title: string;
  description: string;
  type: 'yearbook' | 'regulations' | 'announcements';
}

export function GenericPage({ title, description, type }: GenericPageProps) {
  const { items, loading } = useItems(type);

  const getIcon = () => {
    switch (type) {
      case 'yearbook':
        return BookOpen;
      case 'regulations':
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
        {loading ? (
          <p>Cargando información...</p>
        ) : (
          items.map((item: GenericData) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{item.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.descripcion}</CardDescription>
                <a href={item.pdf_url} target="_blank" rel="noreferrer" className="text-blue-500 underline mt-2 block">
                  Ver PDF
                </a>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Fecha de Publicación: {new Date(item.fecha_publicacion).toLocaleDateString('es-BO')}
                </span>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}