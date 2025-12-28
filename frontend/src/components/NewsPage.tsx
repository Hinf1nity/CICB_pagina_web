import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Calendar, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useNoticias } from '../hooks/useNoticias';

export function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();

  const { noticias, loading, error } = useNoticias();

  const filteredNews = useMemo(() => {
    return noticias.filter((item) => {
      const matchesSearch =
        item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.resumen.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || item.categoria === category;
      return matchesSearch && matchesCategory;
    })
      .sort((a, b) => new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime());
  }, [noticias, searchTerm, category]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Cargando noticias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error al cargar noticias: {error}</p>
      </div>
    );
  }

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      'institucional': 'bg-primary text-primary-foreground',
      'normativa': 'bg-secondary text-secondary-foreground',
      'eventos': 'bg-accent text-accent-foreground',
      'premios': 'bg-chart-4 text-primary',
      'capacitación': 'bg-chart-3 text-primary-foreground',
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
                <SelectItem value="institucional">Institucional</SelectItem>
                <SelectItem value="normativa">Normativa</SelectItem>
                <SelectItem value="eventos">Eventos</SelectItem>
                <SelectItem value="premios">Premios</SelectItem>
                <SelectItem value="capacitación">Capacitación</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => {
            return (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/noticias/${item.id}`)}
              >
                <div className="h-48 overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={item.imagen_url}
                    alt={item.titulo}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getCategoryColor(item.categoria)}>
                      <p className='capitalize'>{item.categoria}</p>
                    </Badge>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{item.fecha_publicacion !== undefined && new Date(item.fecha_publicacion).toLocaleDateString('es-BO')}</span>
                    </div>
                  </div>
                  <CardTitle>{item.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{item.resumen}</CardDescription>
                  <div className="flex items-center justify-between">
                    {/* <div className="flex items-center text-muted-foreground">
              <UserIcon className="w-4 h-4 mr-2" />
              <span>{item.author}</span>
            </div> */}
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/noticias/${item.id}`);
                      }}
                    >
                      Leer más
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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