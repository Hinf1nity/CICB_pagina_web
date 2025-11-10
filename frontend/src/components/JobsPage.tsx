import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardTitle, CardDescription,} from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from './ui/select';
import { Button } from './ui/button';
import { Search, MapPin, Briefcase, Calendar, ArrowRight, } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';

export function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setCategory] = useState('all');
  const navigate = useNavigate();
  const { jobs, loading, error } = useJobs();

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = type === 'all' || job.type === type;
    return matchesSearch && matchesType;
  });

  if (loading) return <p className="text-center mt-10">Cargando trabajos...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="mb-3 text-4xl font-bold">Bolsa de Trabajo</h1>
          <p className="text-primary-foreground/80">
            Encuentra oportunidades profesionales en el campo de la ingeniería civil
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-muted py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar trabajos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={type} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="Ingeniería Civil">Ingeniería Civil</SelectItem>
              <SelectItem value="Arquitectura">Arquitectura</SelectItem>
              <SelectItem value="Construcción">Construcción</SelectItem>
              <SelectItem value="Educación">Educación</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de trabajos */}
      <div className="max-w-7xl mx-auto px-18 py-10">
        <div className="flex flex-col gap-6">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/trabajos/${job.id}`)}
            >
              {/* Contenido principal */}
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-foreground">
                  {job.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-2">
                  {job.company}
                </CardDescription>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin size={16} /> {job.location}
                  </span>
                  <Badge className="flex items-center gap-1 bg-primary text-primary-foreground">
                    <Briefcase size={14} /> {job.type}
                  </Badge>
                  <span className="flex items-center gap-1">
                    {/* <DollarSign size={16} />  */}
                    {job.salary}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />{' '}
                    {new Date(job.date).toLocaleDateString('es-BO')}
                  </span>
                </div>

                <p className="text-sm text-foreground mb-2 line-clamp-2">
                  {job.description}
                </p>

                {job.requirements && (
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Requisitos principales:
                    </p>
                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                      {job.requirements
                        .split(',')
                        .slice(0, 3)
                        .map((req, i) => (
                          <li key={i} className="flex items-center">
                            <span className="text-lg mr-2">•</span>
                            {req.trim()}
                          </li>

                        ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Botón derecho */}
              <div className="w-full sm:w-auto sm:self-start">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/trabajos/${job.id}`);
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 rounded-lg w-full sm:w-auto justify-center">
                  Ver detalles <ArrowRight size={16} />
                </Button>
              </div>
            </Card>
          ))}

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No se encontraron trabajos que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
