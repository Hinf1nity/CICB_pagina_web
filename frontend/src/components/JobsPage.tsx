import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Search, MapPin, Briefcase, Calendar, DollarSign, ArrowRight } from 'lucide-react';

interface JobsPageProps {
  onNavigate?: (page: string, id?: number) => void;
}

export function JobsPage({ onNavigate }: JobsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('all');
  const [type, setType] = useState('all');

  const jobs = [
    {
      id: 1,
      title: 'Ingeniero Civil Senior - Gestión de Proyectos',
      company: 'Constructora Andes S.A.',
      location: 'La Paz',
      type: 'Tiempo Completo',
      salary: 'Bs. 12,000 - 18,000',
      posted: '2025-10-20',
      description: 'Buscamos ingeniero civil con experiencia en gestión de proyectos de infraestructura vial.',
      requirements: ['5+ años de experiencia', 'Registro CICB vigente', 'Experiencia en obras viales']
    },
    {
      id: 2,
      title: 'Ingeniero Estructural',
      company: 'Diseños Estructurales Bolivia',
      location: 'Santa Cruz',
      type: 'Tiempo Completo',
      salary: 'Bs. 10,000 - 15,000',
      posted: '2025-10-18',
      description: 'Especialista en diseño estructural para edificaciones de mediana y gran altura.',
      requirements: ['3+ años de experiencia', 'Manejo de SAP2000, ETABS', 'Conocimiento de normas ACI']
    },
    {
      id: 3,
      title: 'Supervisor de Obra - Proyecto Hidroeléctrico',
      company: 'Energía Limpia Bolivia',
      location: 'Cochabamba',
      type: 'Contrato',
      salary: 'Bs. 15,000 - 20,000',
      posted: '2025-10-15',
      description: 'Supervisión de obras civiles en proyecto hidroeléctrico de 50 MW.',
      requirements: ['8+ años de experiencia', 'Experiencia en obras hidráulicas', 'Disponibilidad para trabajo en campo']
    },
    {
      id: 4,
      title: 'Ingeniero de Costos',
      company: 'Consultores Técnicos Asociados',
      location: 'La Paz',
      type: 'Tiempo Completo',
      salary: 'Bs. 8,000 - 12,000',
      posted: '2025-10-12',
      description: 'Elaboración de presupuestos, análisis de costos y control de proyectos de construcción.',
      requirements: ['2+ años de experiencia', 'Manejo de S10, MS Project', 'Conocimiento de APU']
    },
    {
      id: 5,
      title: 'Ingeniero Residente - Edificación',
      company: 'Inmobiliaria Progreso',
      location: 'Santa Cruz',
      type: 'Tiempo Completo',
      salary: 'Bs. 9,000 - 13,000',
      posted: '2025-10-10',
      description: 'Residencia de obra para proyecto de edificio multifamiliar de 12 pisos.',
      requirements: ['4+ años de experiencia', 'Experiencia en edificaciones', 'Liderazgo de equipos']
    },
    {
      id: 6,
      title: 'Consultor de Proyectos Viales',
      company: 'ABC Ingeniería y Consultoría',
      location: 'Tarija',
      type: 'Freelance',
      salary: 'Por proyecto',
      posted: '2025-10-08',
      description: 'Diseño y consultoría para proyectos de carreteras y puentes.',
      requirements: ['6+ años de experiencia', 'Software de diseño vial', 'Portafolio de proyectos']
    },
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = location === 'all' || job.location === location;
    const matchesType = type === 'all' || job.type === type;
    return matchesSearch && matchesLocation && matchesType;
  });

  const getTypeColor = (jobType: string) => {
    const colors: { [key: string]: string } = {
      'Tiempo Completo': 'bg-primary text-primary-foreground',
      'Contrato': 'bg-secondary text-secondary-foreground',
      'Freelance': 'bg-accent text-accent-foreground',
    };
    return colors[jobType] || 'bg-muted text-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="mb-3">Ofertas Laborales</h1>
          <p>Encuentra oportunidades profesionales en el campo de la ingeniería civil</p>
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
                placeholder="Buscar trabajos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ubicaciones</SelectItem>
                <SelectItem value="La Paz">La Paz</SelectItem>
                <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                <SelectItem value="Cochabamba">Cochabamba</SelectItem>
                <SelectItem value="Tarija">Tarija</SelectItem>
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Tipo de trabajo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Tiempo Completo">Tiempo Completo</SelectItem>
                <SelectItem value="Contrato">Contrato</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card 
              key={job.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onNavigate && onNavigate('job-detail', job.id)}
            >
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{job.title}</CardTitle>
                    <CardDescription className="mb-3">{job.company}</CardDescription>
                    
                    <div className="flex flex-wrap gap-3 text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        <Badge className={getTypeColor(job.type)}>
                          {job.type}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Publicado: {new Date(job.posted).toLocaleDateString('es-BO')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate && onNavigate('job-detail', job.id);
                      }}
                    >
                      Ver Detalles
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-foreground">{job.description}</p>
                <div>
                  <h4 className="mb-2 text-foreground">Requisitos principales:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {job.requirements.slice(0, 3).map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                  {job.requirements.length > 3 && (
                    <p className="text-primary mt-2">
                      + {job.requirements.length - 3} requisitos más...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron ofertas laborales que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
