import { useNavigate, useParams } from 'react-router-dom';
import {ArrowLeft, MapPin, Briefcase, Calendar, FileText, Download, Building2, CheckCircle} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useJobDetail } from '../hooks/useJobs';

export function JobDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { job, loading, error } = useJobDetail(id);
  const getTypeColor = (jobType: string) => {
    
    const colors: Record<string, string> = {
      'Tiempo Completo': 'bg-primary text-primary-foreground',
      'Contrato': 'bg-secondary text-secondary-foreground',
      'Freelance': 'bg-accent text-accent-foreground',
      'Ingeniería Civil': 'bg-primary text-primary-foreground',
      'Arquitectura': 'bg-secondary text-secondary-foreground',
      'Construcción': 'bg-accent text-accent-foreground',
      'Educación': 'bg-chart-4 text-primary',
    };
    return colors[jobType] || 'bg-muted text-foreground';
  };

  if (loading) return <p className="text-center mt-10">Cargando empleo...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!job?.id) return <p className="text-center mt-10 text-muted-foreground">No se encontró el empleo solicitado.</p>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/empleos')}
            className="text-primary-foreground hover:bg-primary-foreground/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Ofertas Laborales
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-4">{job.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-foreground">{job.company}</span>
              </div>

              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <Badge className={getTypeColor(job.type)}>
                    {job.type}
                  </Badge>
                </div>
                 <div className="flex items-center">
                  {/* <DollarSign className="w-4 h-4 mr-2" /> */}
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Publicado: {new Date(job.date).toLocaleDateString('es-BO')}</span>
                </div>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Job Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Descripción del Puesto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(job.requirements) && job.requirements.length > 0 ? (
                  <ul className="space-y-2">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1" />
                        <span className="text-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No se especificaron requisitos.</p>
                )}
              </CardContent>
            </Card>

            {/* PDF (si existe) */}
            {job.pdfUrl && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="text-foreground">Términos de Referencia</h3>
                        <p className="text-muted-foreground">Documento detallado de la convocatoria</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => window.open(job.pdfUrl, '_blank')}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar PDF
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden bg-muted">
                    <iframe
                      src={job.pdfUrl}
                      className="w-full h-[500px]"
                      title="Términos de Referencia"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 mb-6">
              <CardContent className="p-6">
                <h3 className="text-foreground mb-4">Detalles de la Convocatoria</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-muted-foreground">Ubicación</p>
                      <p className="text-foreground">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-muted-foreground">Tipo</p>
                      <p className="text-foreground">{job.type}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    {/* <DollarSign className="w-5 h-5 text-primary mt-1" /> */}
                    <div>
                      <p className="text-muted-foreground">Salario</p>
                      <p className="text-foreground">{job.salary}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-3">
                  Postular Ahora
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Enlace copiado al portapapeles');
                  }}
                >
                  Compartir Oferta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}