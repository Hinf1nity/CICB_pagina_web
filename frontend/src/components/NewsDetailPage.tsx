import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User as UserIcon, FileText, Download } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';

export function NewsDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  // Datos de ejemplo - en producción vendrían de una API o estado global
  type NewsItem = {
    id: number;
    title: string;
    category: string;
    date: string;
    author: string;
    image: string;
    content: string;
    pdfUrl?: string;
  };

  const newsData: Record<number, NewsItem> = {
    1: {
      id: 1,
      title: 'Convocatoria a Asamblea General Ordinaria 2025',
      category: 'Institucional',
      date: '2025-10-22',
      author: 'Directorio CICB',
      image: 'https://images.unsplash.com/photo-1748345952129-3bdd7d39f155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMHRlYW0lMjBvZmZpY2V8ZW58MXx8fHwxNzYxMTYzNzQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      content: `
        <p>Estimados colegas miembros del Colegio de Ingenieros Civiles de Bolivia,</p>
        
        <p>Por medio de la presente, el Directorio del CICB convoca a todos los miembros activos a la Asamblea General Ordinaria que se llevará a cabo el día 15 de noviembre de 2025 a horas 18:00 en el Auditorio Principal de nuestra sede institucional.</p>
        
        <h3>Orden del Día:</h3>
        <ol>
          <li>Verificación de quórum y apertura de la Asamblea</li>
          <li>Lectura y aprobación del acta de la Asamblea anterior</li>
          <li>Informe de gestión del Directorio 2024-2025</li>
          <li>Presentación de estados financieros</li>
          <li>Aprobación del presupuesto para la gestión 2026</li>
          <li>Informe de la Comisión de Ética y Disciplina</li>
          <li>Propuestas y proyectos para la gestión 2026</li>
          <li>Varios</li>
        </ol>
        
        <h3>Documentación Requerida:</h3>
        <p>Los miembros deberán presentar su carnet de colegiado vigente y estar al día con sus obligaciones institucionales para poder participar con voz y voto.</p>
        
        <h3>Transmisión Virtual:</h3>
        <p>Para aquellos colegas que no puedan asistir presencialmente, la asamblea será transmitida en vivo a través de nuestra plataforma virtual. Los enlaces de acceso serán enviados por correo electrónico 24 horas antes del evento.</p>
        
        <p>Contamos con su presencia para fortalecer nuestra institución.</p>
        
        <p><strong>Directorio CICB</strong><br>
        Gestión 2024-2025</p>
      `,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    2: {
      id: 2,
      title: 'Nuevo Reglamento de Registro de Proyectos',
      category: 'Normativa',
      date: '2025-10-18',
      author: 'Comisión Técnica',
      image: 'https://images.unsplash.com/photo-1653201587864-c6280a0bb4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyaW5nJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc2MTA5NTQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      content: `
        <p>La Comisión Técnica del Colegio de Ingenieros Civiles de Bolivia informa a todos los colegiados sobre la aprobación del nuevo Reglamento de Registro de Proyectos, que entrará en vigencia a partir del 1 de diciembre de 2025.</p>
        
        <h3>Principales Cambios:</h3>
        
        <h4>1. Requisitos de Documentación</h4>
        <p>Se actualizan los requisitos documentales para el registro de proyectos, incluyendo:</p>
        <ul>
          <li>Memoria descriptiva actualizada según nuevos formatos</li>
          <li>Planos digitales en formato CAD editable</li>
          <li>Cálculo estructural firmado digitalmente</li>
          <li>Certificado de factibilidad de servicios</li>
        </ul>
        
        <h4>2. Proceso de Registro Digital</h4>
        <p>Se implementa un sistema de registro completamente digital que permitirá:</p>
        <ul>
          <li>Carga de documentos en línea</li>
          <li>Seguimiento en tiempo real del estado del trámite</li>
          <li>Notificaciones automáticas por correo electrónico</li>
          <li>Descarga de certificados digitales</li>
        </ul>
        
        <h4>3. Plazos y Costos</h4>
        <p>Se reducen los plazos de revisión y aprobación:</p>
        <ul>
          <li>Proyectos menores: 5 días hábiles</li>
          <li>Proyectos medianos: 10 días hábiles</li>
          <li>Proyectos mayores: 15 días hábiles</li>
        </ul>
        
        <h3>Capacitación</h3>
        <p>Se realizarán talleres de capacitación gratuitos durante el mes de noviembre para todos los colegiados. Las inscripciones están abiertas en nuestra página web.</p>
      `,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    // Datos adicionales para otras noticias...
    3: {
      id: 3,
      title: 'Seminario Internacional de Ingeniería Estructural',
      category: 'Eventos',
      date: '2025-10-15',
      author: 'Comité de Eventos',
      image: 'https://images.unsplash.com/photo-1696966627839-24b0297e365c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2xpdmlhJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MTE2Mzc0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      content: `
        <p>El Colegio de Ingenieros Civiles de Bolivia tiene el honor de invitar a todos sus colegiados al Seminario Internacional de Ingeniería Estructural 2025.</p>
        
        <h3>Detalles del Evento</h3>
        <p><strong>Fecha:</strong> 25-27 de noviembre de 2025<br>
        <strong>Lugar:</strong> Hotel Presidente, Salón Illimani - La Paz, Bolivia<br>
        <strong>Horario:</strong> 8:00 AM - 6:00 PM</p>
        
        <h3>Expositores Confirmados</h3>
        <ul>
          <li>Dr. Carlos Mendoza (Chile) - Diseño Sísmico Avanzado</li>
          <li>Ing. María González (Argentina) - Estructuras de Gran Altura</li>
          <li>Dr. Roberto Silva (Perú) - Análisis No Lineal</li>
          <li>Ing. Ana Rodríguez (Colombia) - BIM en Diseño Estructural</li>
        </ul>
        
        <h3>Temario</h3>
        <ol>
          <li>Diseño antisísmico según las últimas normativas internacionales</li>
          <li>Modelación y análisis de estructuras complejas</li>
          <li>Uso de tecnología BIM en proyectos estructurales</li>
          <li>Materiales innovadores en construcción</li>
          <li>Casos de estudio de proyectos emblemáticos de la región</li>
        </ol>
        
        <h3>Inversión</h3>
        <p>Miembros CICB: Bs. 800<br>
        No miembros: Bs. 1,200<br>
        Estudiantes: Bs. 400</p>
        
        <p>Incluye: Certificado de participación, material del seminario, coffee breaks y almuerzo.</p>
      `,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  };

  const news = newsData[Number(id)] || newsData[1];

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
      <div className="bg-primary text-primary-foreground py-8">
        <div className="max-w-5xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/noticias')}
            className="text-primary-foreground hover:bg-primary-foreground/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Noticias
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <ImageWithFallback
            src={news.image}
            alt={news.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Badge className={getCategoryColor(news.category)}>
              {news.category}
            </Badge>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(news.date).toLocaleDateString('es-BO', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <UserIcon className="w-4 h-4 mr-2" />
              <span>{news.author}</span>
            </div>
          </div>

          <h1 className="text-foreground mb-4">{news.title}</h1>
        </div>

        <Separator className="mb-8" />

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none mb-12 text-foreground"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {/* PDF Document Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="text-foreground">Documento Oficial</h3>
                  <p className="text-muted-foreground">Descarga o visualiza el documento completo en PDF</p>
                </div>
              </div>
              <Button
                onClick={() => window.open(news.pdfUrl, '_blank')}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
            </div>

            {/* PDF Viewer */}
            <div className="border rounded-lg overflow-hidden bg-muted">
              <iframe
                src={news.pdfUrl}
                className="w-full h-[600px]"
                title="Documento PDF"
              />
            </div>
          </CardContent>
        </Card>

        {/* Related News */}
        <div>
          <h3 className="text-foreground mb-4">Noticias Relacionadas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].filter(id_filter => id_filter !== Number(id)).slice(0, 3).map((id_map) => {
              const relatedNews = newsData[id_map];
              if (!relatedNews) return null;
              
              return (
                <Card
                  key={id_map}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/noticias/${id_map}`)}
                >
                  <div className="h-32 bg-muted overflow-hidden">
                    <ImageWithFallback
                      src={relatedNews.image}
                      alt={relatedNews.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge className={`${getCategoryColor(relatedNews.category)} mb-2`}>
                      {relatedNews.category}
                    </Badge>
                    <h4 className="text-foreground line-clamp-2">{relatedNews.title}</h4>
                    <p className="text-muted-foreground mt-2">
                      {new Date(relatedNews.date).toLocaleDateString('es-BO')}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
