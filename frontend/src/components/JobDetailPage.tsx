import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Calendar, DollarSign, FileText, Download, Building2, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

export function JobDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  // Datos de ejemplo - en producción vendrían de una API o estado global
  type Job = {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    posted: string;
    deadline: string;
    vacancies: number;
    description: string;
    responsibilities: string[];
    requirements: string[];
    benefits: string[];
    aboutCompany: string;
    pdfUrl: string;
  };

  const jobsData: Record<number, Job> = {
    1: {
      id: 1,
      title: 'Ingeniero Civil Senior - Gestión de Proyectos',
      company: 'Constructora Andes S.A.',
      location: 'La Paz',
      type: 'Tiempo Completo',
      salary: 'Bs. 12,000 - 18,000',
      posted: '2025-10-20',
      deadline: '2025-11-20',
      vacancies: 2,
      description: `
        Constructora Andes S.A., empresa líder en el sector de infraestructura vial en Bolivia, 
        busca incorporar a su equipo un Ingeniero Civil Senior con sólida experiencia en gestión 
        de proyectos de gran envergadura.
      `,
      responsibilities: [
        'Liderar la planificación, ejecución y cierre de proyectos de infraestructura vial',
        'Coordinar equipos multidisciplinarios de ingenieros y técnicos',
        'Supervisar el cumplimiento de cronogramas, presupuestos y estándares de calidad',
        'Elaborar informes técnicos y presentaciones para clientes y directivos',
        'Gestionar relaciones con stakeholders, incluyendo entidades gubernamentales',
        'Asegurar el cumplimiento de normativas de seguridad y medioambientales',
        'Implementar mejores prácticas en metodologías de gestión de proyectos',
      ],
      requirements: [
        'Título profesional de Ingeniero Civil',
        'Registro vigente en el Colegio de Ingenieros Civiles de Bolivia (CICB)',
        'Mínimo 5 años de experiencia en gestión de proyectos viales',
        'Experiencia comprobable en obras de carreteras, puentes o túneles',
        'Conocimiento avanzado de software de gestión de proyectos (MS Project, Primavera P6)',
        'Dominio de normativas bolivianas de construcción vial',
        'Certificación PMP o similar (deseable)',
        'Inglés intermedio (deseable)',
      ],
      benefits: [
        'Salario competitivo según experiencia',
        'Seguro médico privado para el empleado y su familia',
        'Bonos por desempeño y cumplimiento de objetivos',
        'Capacitación continua y desarrollo profesional',
        'Vehículo de la empresa',
        'Oportunidades de crecimiento dentro de la organización',
        'Ambiente de trabajo profesional y desafiante',
      ],
      aboutCompany: `
        Constructora Andes S.A. cuenta con más de 25 años de experiencia en el mercado boliviano, 
        habiendo ejecutado exitosamente proyectos emblemáticos de infraestructura en todo el país. 
        Nuestra misión es contribuir al desarrollo de Bolivia mediante proyectos de ingeniería de 
        excelencia que mejoren la conectividad y calidad de vida de la población.
      `,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    2: {
      id: 2,
      title: 'Ingeniero Estructural',
      company: 'Diseños Estructurales Bolivia',
      location: 'Santa Cruz',
      type: 'Tiempo Completo',
      salary: 'Bs. 10,000 - 15,000',
      posted: '2025-10-18',
      deadline: '2025-11-15',
      vacancies: 1,
      description: `
        Diseños Estructurales Bolivia, firma especializada en diseño y cálculo estructural, 
        busca ingeniero con experiencia en edificaciones de mediana y gran altura.
      `,
      responsibilities: [
        'Diseño y cálculo estructural de edificaciones',
        'Modelación en software especializado (SAP2000, ETABS)',
        'Elaboración de memorias de cálculo y planos estructurales',
        'Coordinación con arquitectos y otros especialistas',
        'Revisión y supervisión de proyectos estructurales',
      ],
      requirements: [
        'Título de Ingeniero Civil',
        'Registro CICB vigente',
        'Mínimo 3 años de experiencia en diseño estructural',
        'Dominio de SAP2000, ETABS y AutoCAD',
        'Conocimiento de normas ACI, AISC',
        'Experiencia en edificaciones de concreto armado y acero',
      ],
      benefits: [
        'Salario competitivo',
        'Seguro de salud',
        'Bonos por proyecto',
        'Capacitación especializada',
        'Modalidad híbrida de trabajo',
      ],
      aboutCompany: `
        Diseños Estructurales Bolivia es una empresa dedicada al diseño estructural con 15 años 
        de trayectoria y proyectos exitosos en todo el eje central del país.
      `,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    3: {
      id: 3,
      title: 'Supervisor de Obra - Proyecto Hidroeléctrico',
      company: 'Energía Limpia Bolivia',
      location: 'Cochabamba',
      type: 'Contrato',
      salary: 'Bs. 15,000 - 20,000',
      posted: '2025-10-15',
      deadline: '2025-11-10',
      vacancies: 1,
      description: `
        Energía Limpia Bolivia requiere supervisor de obra para proyecto hidroeléctrico de 50 MW 
        ubicado en la región de Cochabamba.
      `,
      responsibilities: [
        'Supervisión integral de obras civiles del proyecto hidroeléctrico',
        'Control de calidad de materiales y procesos constructivos',
        'Gestión de cronogramas y presupuestos de obra',
        'Coordinación con contratistas y proveedores',
        'Elaboración de informes de avance',
      ],
      requirements: [
        'Título de Ingeniero Civil',
        'Registro CICB vigente',
        'Mínimo 8 años de experiencia',
        'Experiencia comprobable en obras hidráulicas',
        'Disponibilidad para trabajo en campo',
        'Licencia de conducir',
      ],
      benefits: [
        'Salario atractivo',
        'Vivienda en campamento',
        'Alimentación incluida',
        'Seguro de vida y salud',
        'Transporte',
      ],
      aboutCompany: `
        Energía Limpia Bolivia desarrolla proyectos de energía renovable contribuyendo al 
        desarrollo sostenible del país.
      `,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  };

  const job = jobsData[Number(id)] || jobsData[1];

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
              <h1 className="text-foreground mb-4">{job.title}</h1>
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
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Publicado: {new Date(job.posted).toLocaleDateString('es-BO')}</span>
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

            {/* Responsibilities */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Responsabilidades</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-foreground">{resp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((req: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span className="text-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Beneficios</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.benefits.map((benefit: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-accent mr-2">★</span>
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* About Company */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Sobre la Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{job.aboutCompany}</p>
              </CardContent>
            </Card>

            {/* PDF Document */}
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

                {/* PDF Viewer */}
                <div className="border rounded-lg overflow-hidden bg-muted">
                  <iframe
                    src={job.pdfUrl}
                    className="w-full h-[500px]"
                    title="Términos de Referencia"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Application Card */}
            <Card className="sticky top-4 mb-6">
              <CardContent className="p-6">
                <h3 className="text-foreground mb-4">Detalles de la Convocatoria</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-muted-foreground">Fecha límite</p>
                      <p className="text-foreground">
                        {new Date(job.deadline).toLocaleDateString('es-BO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-muted-foreground">Vacantes</p>
                      <p className="text-foreground">{job.vacancies} {job.vacancies === 1 ? 'posición' : 'posiciones'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-muted-foreground">Ubicación</p>
                      <p className="text-foreground">{job.location}, Bolivia</p>
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
                    // Simular compartir
                    alert('Enlace copiado al portapapeles');
                  }}
                >
                  Compartir Oferta
                </Button>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle>Consejos para Postular</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Revisa cuidadosamente todos los requisitos antes de postular</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Asegúrate de tener tu registro CICB vigente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Prepara un CV actualizado y una carta de presentación</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Incluye referencias profesionales verificables</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
