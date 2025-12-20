import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Calendar, FileText, Download, Building2, CheckCircle, Banknote } from 'lucide-react';
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
      'completo': 'bg-primary text-primary-foreground',
      'contrato': 'bg-secondary text-secondary-foreground',
      'freelance': 'bg-accent text-accent-foreground',
      'ingeniería civil': 'bg-primary text-primary-foreground',
      'arquitectura': 'bg-secondary text-secondary-foreground',
      'construcción': 'bg-accent text-accent-foreground',
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
            onClick={() => navigate('/trabajos')}
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
              <h1 className="text-3xl font-bold text-foreground mb-4">{job.titulo}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-foreground">{job.nombre_empresa}</span>
              </div>

              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{job.ubicacion}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <Badge className={getTypeColor(job.tipo_contrato)}>
                    <p className="capitalize">{job.tipo_contrato}</p>
                  </Badge>
                </div>
                <div className="flex items-center">
                  {job.salario && (
                    <>
                      <Banknote className="w-4 h-4 mr-2" />
                      <span>{job.salario}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Publicado: {job.fecha_publicacion !== undefined && new Date(job.fecha_publicacion).toLocaleDateString('es-BO')}</span>
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
                <p className="text-foreground leading-relaxed">{job.descripcion}</p>
              </CardContent>
            </Card>
            {/* Informacion de la Empresa */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Sobre la empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{job.sobre_empresa}</p>
              </CardContent>
            </Card>
            {/* Requirements */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(job.requisitos) && job.requisitos.length > 0 ? (
                  <ul className="space-y-2">
                    {job.requisitos.map((req, idx) => (
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
            {/* Responabilties */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Responsabilidades</CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(job.responsabilidades) && job.responsabilidades.length > 0 ? (
                  <ul className="space-y-2">
                    {job.responsabilidades.map((resp, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-1" />
                        <span className="text-foreground">{resp}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    No se especificaron responsabilidades.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* PDF (si existe) */}
            {job.pdf_url && (
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
                      onClick={() => window.open(job.pdf_url, '_blank')}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar PDF
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden bg-muted">
                    <iframe
                      src={job.pdf_url}
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
                      <p className="text-foreground">{job.ubicacion}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-muted-foreground">Tipo</p>
                      <p className="text-foreground">{job.tipo_contrato}</p>
                    </div>
                  </div>
                  {job.salario && (
                    <div className="flex items-start gap-3">
                      <Banknote className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="text-muted-foreground">Referencia Salarial</p>
                        <p className="text-foreground">{job.salario}</p>
                      </div>
                    </div>
                  )}
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