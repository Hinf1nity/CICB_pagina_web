import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Download } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { useNoticias, useNoticiaDetail } from '../hooks/useNoticias';

export function NewsDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  // Datos de ejemplo - en producción vendrían de una API o estado global

  // const { noticias } = useNoticias();

  const { noticia, loading, error } = useNoticiaDetail(id);
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
            src={noticia.imagen_url}
            alt={noticia.titulo}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Badge className={getCategoryColor(noticia.categoria)}>
              {noticia.categoria}
            </Badge>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(noticia.fecha_publicacion).toLocaleDateString('es-BO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            {/* <div className="flex items-center text-muted-foreground">
              <UserIcon className="w-4 h-4 mr-2" />
              <span>{noticias.author}</span>
            </div> */}
          </div>
          <h1 className="text-foreground mb-4">{noticia.titulo}</h1>
        </div>

        <Separator className="mb-8" />

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none mb-12 text-foreground"
          dangerouslySetInnerHTML={{ __html: noticia.descripcion }}
        />

        {/* PDF Document Section */}
        {noticia.pdf_url && (
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
                  onClick={() => window.open(noticia.pdf_url, '_blank')}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>

              {/* PDF Viewer */}
              <div className="border rounded-lg overflow-hidden bg-muted">
                <iframe
                  src={noticia.pdf_url}
                  className="w-full h-[600px]"
                  title="Documento PDF"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related News */}
        {/* <div>
          <h3 className="text-foreground mb-4">Noticias Relacionadas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2].filter(id_filter => id_filter !== Number(id)).slice(0, 3).map((id_map) => {
              const relatedNews = noticias[id_map - 1];
              if (!relatedNews) return null;

              return (
                <Card
                  key={id_map}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/noticias/${id_map}`)}
                >
                  <div className="h-32 bg-muted overflow-hidden">
                    <ImageWithFallback
                      src={relatedNews.imagen_url}
                      alt={relatedNews.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge className={`${getCategoryColor(relatedNews.categoria)} mb-2`}>
                      {relatedNews.categoria}
                    </Badge>
                    <h4 className="text-foreground line-clamp-2">{relatedNews.titulo}</h4>
                    <p className="text-muted-foreground mt-2">
                      {new Date(relatedNews.fecha_publicacion).toLocaleDateString('es-BO')}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div> */}
      </div>
    </div>
  );
}
