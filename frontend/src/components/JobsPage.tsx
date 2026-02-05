import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardTitle, CardDescription, } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, MapPin, Briefcase, Calendar, ArrowRight, } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import { useDebounce } from 'use-debounce';

export function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);
  const navigate = useNavigate();
  const { jobs, loading, error, count, next, previous } = useJobs(page, debouncedSearchTerm);
  const pageSize = 20;
  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  if (loading) return <p className="text-center mt-10">Cargando trabajos...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Hubo un error al cargar los trabajos.</p>;

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
      <div className="bg-muted py-6">
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
        </div>
      </div>

      <div className="text-muted-foreground mt-4 max-w-7xl mx-auto px-4">
        Mostrando {1 + (page - 1) * pageSize}-{Math.min(page * pageSize, count)} de {count} trabajos
      </div>

      {/* Lista de trabajos */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/trabajos/${job.id}`)}
            >
              {/* Contenido principal */}
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-foreground">
                  {job.titulo}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-2">
                  {job.nombre_empresa}
                </CardDescription>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin size={16} /> {job.ubicacion}
                  </span>
                  <Badge className="flex items-center gap-1 bg-primary text-primary-foreground">
                    <Briefcase size={14} /> <p className="capitalize">{job.tipo_contrato}</p>
                  </Badge>
                  <span className="flex items-center gap-1">
                    {/* <DollarSign size={16} />  */}
                    {job.salario}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />{' '}
                    {job.fecha_publicacion ? new Date(job.fecha_publicacion).toLocaleDateString('es-BO') : 'N/A'}
                  </span>
                </div>

                <p className="text-sm text-foreground mb-2 line-clamp-2">
                  {job.descripcion}
                </p>
                {Array.isArray(job.requisitos) && job.requisitos.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Requisitos principales:
                    </p>
                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                      {job.requisitos.slice(0, 3).map((req, i) => (
                        <li key={i} className="flex items-center">
                          <span className="text-lg mr-2">•</span>
                          {req}
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

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No se encontraron trabajos que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
        {/* creamos la paginacion y sus flechas */}
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
      </div>
    </div>
  );
}
