import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { FileText, BookOpen, Bell } from 'lucide-react';

interface GenericPageProps {
  title: string;
  description: string;
  type: 'yearbook' | 'regulations' | 'announcements';
}

export function GenericPage({ title, description, type }: GenericPageProps) {
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

  const getContent = () => {
    switch (type) {
      case 'yearbook':
        return [
          { title: 'Anuario 2024', description: 'Registro completo de miembros activos durante el año 2024' },
          { title: 'Anuario 2023', description: 'Registro completo de miembros activos durante el año 2023' },
          { title: 'Anuario 2022', description: 'Registro completo de miembros activos durante el año 2022' },
        ];
      case 'regulations':
        return [
          { title: 'Reglamento General del CICB', description: 'Normativa principal que rige las actividades del colegio' },
          { title: 'Código de Ética Profesional', description: 'Principios éticos que deben seguir todos los colegiados' },
          { title: 'Reglamento de Registro de Proyectos', description: 'Normas para el registro y validación de proyectos' },
          { title: 'Reglamento de Certificación', description: 'Procedimientos para obtención de certificados profesionales' },
        ];
      case 'announcements':
        return [
          { title: 'Convocatoria Asamblea General Ordinaria', description: 'Se convoca a asamblea el 15 de noviembre de 2025' },
          { title: 'Concurso de Proyectos Innovadores', description: 'Participa en el concurso anual de innovación en ingeniería' },
          { title: 'Elecciones Directorio 2026', description: 'Convocatoria para elecciones del nuevo directorio' },
        ];
    }
  };

  const items = getContent();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-3">
            <Icon className="w-10 h-10 mr-4" />
            <h1>{title}</h1>
          </div>
          <p>{description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
