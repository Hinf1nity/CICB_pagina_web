import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Calendar, User as UserIcon, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface NewsPageProps {
  onNavigate?: (page: string, id?: number) => void;
}

export function NewsPage({ onNavigate }: NewsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const newsItems = [
    {
      id: 1,
      title: 'Convocatoria a Asamblea General Ordinaria 2025',
      excerpt: 'Se convoca a todos los miembros activos del Colegio de Ingenieros Civiles de Bolivia a la Asamblea General Ordinaria que se llevará a cabo el próximo 15 de noviembre.',
      category: 'Institucional',
      date: '2025-10-22',
      author: 'Directorio CICB',
      image: 'https://images.unsplash.com/photo-1748345952129-3bdd7d39f155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMHRlYW0lMjBvZmZpY2V8ZW58MXx8fHwxNzYxMTYzNzQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 2,
      title: 'Nuevo Reglamento de Registro de Proyectos',
      excerpt: 'El Colegio aprobó nuevas normativas para el registro y validación de proyectos de ingeniería civil. Todos los colegiados deben familiarizarse con estos cambios.',
      category: 'Normativa',
      date: '2025-10-18',
      author: 'Comisión Técnica',
      image: 'https://images.unsplash.com/photo-1653201587864-c6280a0bb4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyaW5nJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc2MTA5NTQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 3,
      title: 'Seminario Internacional de Ingeniería Estructural',
      excerpt: 'El CICB organiza un seminario internacional con expertos de América Latina sobre las últimas tendencias en diseño estructural antisísmico.',
      category: 'Eventos',
      date: '2025-10-15',
      author: 'Comité de Eventos',
      image: 'https://images.unsplash.com/photo-1696966627839-24b0297e365c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2xpdmlhJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MTE2Mzc0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 4,
      title: 'Reconocimiento a Proyectos Destacados 2024',
      excerpt: 'El colegio reconoce a los mejores proyectos de ingeniería civil del año 2024, destacando la innovación y calidad técnica.',
      category: 'Premios',
      date: '2025-10-10',
      author: 'Directorio CICB',
      image: 'https://images.unsplash.com/photo-1748345952129-3bdd7d39f155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMHRlYW0lMjBvZmZpY2V8ZW58MXx8fHwxNzYxMTYzNzQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 5,
      title: 'Capacitación en Normativa de Construcción Sostenible',
      excerpt: 'Curso de actualización sobre construcción sostenible y certificaciones ambientales para proyectos de ingeniería.',
      category: 'Capacitación',
      date: '2025-10-05',
      author: 'Comisión de Capacitación',
      image: 'https://images.unsplash.com/photo-1653201587864-c6280a0bb4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyaW5nJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc2MTA5NTQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 6,
      title: 'Apertura de Nuevas Oficinas Regionales',
      excerpt: 'El CICB amplía su presencia en el país con la apertura de oficinas regionales en Santa Cruz y Cochabamba.',
      category: 'Institucional',
      date: '2025-09-28',
      author: 'Directorio CICB',
      image: 'https://images.unsplash.com/photo-1696966627839-24b0297e365c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2xpdmlhJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MTE2Mzc0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
  ];

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      'Institucional': 'bg-primary text-primary-foreground',
      'Normativa': 'bg-secondary text-secondary-foreground',
      'Eventos': 'bg-accent text-accent-foreground',
      'Premios': 'bg-chart-4 text-primary',
      'Capacitación': 'bg-chart-3 text-primary-foreground',
    };
    return colors[cat] || 'bg-muted text-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="mb-3">Noticias</h1>
          <p>Mantente informado sobre las últimas novedades del Colegio de Ingenieros Civiles de Bolivia</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-muted py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar noticias..."
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
                <SelectItem value="Institucional">Institucional</SelectItem>
                <SelectItem value="Normativa">Normativa</SelectItem>
                <SelectItem value="Eventos">Eventos</SelectItem>
                <SelectItem value="Premios">Premios</SelectItem>
                <SelectItem value="Capacitación">Capacitación</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <Card 
              key={item.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onNavigate && onNavigate('news-detail', item.id)}
            >
              <div className="h-48 overflow-hidden bg-muted">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getCategoryColor(item.category)}>
                    {item.category}
                  </Badge>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(item.date).toLocaleDateString('es-BO')}</span>
                  </div>
                </div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{item.excerpt}</CardDescription>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-muted-foreground">
                    <UserIcon className="w-4 h-4 mr-2" />
                    <span>{item.author}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-primary hover:text-primary/80"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onNavigate) {
                        onNavigate('news-detail', item.id);
                      }
                    }}
                  >
                    Leer más
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron noticias que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
