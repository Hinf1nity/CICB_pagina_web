import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Building2, Users, Award, BookOpen, Target, Eye, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';


export function HomePage() {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, label: 'Miembros Activos', value: '2,500+' },
    { icon: Building2, label: 'Proyectos Certificados', value: '1,200+' },
    { icon: Award, label: 'Años de Trayectoria', value: '45' },
    { icon: BookOpen, label: 'Eventos Anuales', value: '50+' },
  ];

  const features = [
    {
      title: 'Certificación Profesional',
      description: 'Otorgamos certificaciones y validaciones para ingenieros civiles en Bolivia.',
      icon: Award,
    },
    {
      title: 'Red de Profesionales',
      description: 'Conecta con miles de ingenieros civiles colegiados en todo el país.',
      icon: Users,
    },
    {
      title: 'Recursos y Reglamentos',
      description: 'Acceso a normativas, reglamentos y recursos técnicos actualizados.',
      icon: BookOpen,
    },
    {
      title: 'Proyectos y Licitaciones',
      description: 'Información sobre proyectos, licitaciones y oportunidades laborales.',
      icon: Building2,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1653201587864-c6280a0bb4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyaW5nJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc2MTA5NTQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Construcción civil"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-primary-foreground max-w-2xl">
            <h1 className="mb-4">Colegio de Ingenieros Civiles de Bolivia</h1>
            <p className="mb-6">
              Comprometidos con la excelencia profesional y el desarrollo de la ingeniería civil en Bolivia. 
              Representamos a los profesionales más capacitados del país.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate('/perfil')}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => navigate('/noticias')}
                variant="outline"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Ver Noticias
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card rounded-lg p-6 text-center shadow-sm">
                <stat.icon className="w-12 h-12 mx-auto mb-3 text-primary" />
                <div className="text-primary">{stat.value}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiénes Somos Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Info className="w-8 h-8 text-primary mr-3" />
                <h2 className="text-foreground">¿Quiénes Somos?</h2>
              </div>
              <p className="text-foreground mb-4">
                El Colegio de Ingenieros Civiles de Bolivia (CICB) es una institución profesional que agrupa 
                a los ingenieros civiles más destacados del país. Fundado con el objetivo de promover la 
                excelencia técnica y el desarrollo profesional, nos hemos consolidado como la máxima autoridad 
                en la regulación y certificación de la práctica de la ingeniería civil en Bolivia.
              </p>
              <p className="text-foreground mb-4">
                Representamos a más de 2,500 profesionales activos que trabajan incansablemente en el desarrollo 
                de la infraestructura y el progreso de nuestro país. Nuestro compromiso es garantizar la calidad, 
                ética y competencia profesional en cada proyecto que nuestros colegiados realizan.
              </p>
              <p className="text-muted-foreground">
                A través de programas de capacitación continua, regulación profesional y servicios de certificación, 
                contribuimos al fortalecimiento de la ingeniería civil boliviana y al desarrollo sostenible de nuestra nación.
              </p>
            </div>
            <div className="h-[400px] rounded-lg overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1696966627839-24b0297e365c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2xpdmlhJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MTE2Mzc0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Ingeniería Civil en Bolivia"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Visión y Misión Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visión */}
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-8 border border-primary-foreground/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mr-4">
                  <Eye className="w-8 h-8 text-accent-foreground" />
                </div>
                <h2 className="text-primary-foreground">Nuestra Visión</h2>
              </div>
              <p className="text-primary-foreground/90 leading-relaxed">
                Ser la institución líder en Bolivia que promueve la excelencia en la ingeniería civil, 
                reconocida nacional e internacionalmente por su compromiso con el desarrollo sostenible, 
                la innovación tecnológica y la formación de profesionales altamente capacitados que 
                contribuyan al progreso y bienestar de la sociedad boliviana.
              </p>
            </div>

            {/* Misión */}
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-8 border border-primary-foreground/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mr-4">
                  <Target className="w-8 h-8 text-accent-foreground" />
                </div>
                <h2 className="text-primary-foreground">Nuestra Misión</h2>
              </div>
              <p className="text-primary-foreground/90 leading-relaxed">
                Regular, representar y fortalecer el ejercicio profesional de la ingeniería civil en Bolivia, 
                garantizando los más altos estándares de calidad, ética y competencia técnica. Promovemos 
                la actualización continua de nuestros colegiados, fomentamos la investigación y el desarrollo 
                tecnológico, y contribuimos activamente al desarrollo sostenible del país.
              </p>
            </div>
          </div>

          {/* Valores */}
          <div className="mt-12">
            <h3 className="text-center mb-8 text-primary-foreground">Nuestros Valores</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-accent-foreground" />
                </div>
                <h4 className="text-primary-foreground mb-2">Excelencia</h4>
                <p className="text-primary-foreground/80">
                  Buscamos la calidad en cada proyecto y servicio
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-accent-foreground" />
                </div>
                <h4 className="text-primary-foreground mb-2">Integridad</h4>
                <p className="text-primary-foreground/80">
                  Actuamos con honestidad y transparencia
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-8 h-8 text-accent-foreground" />
                </div>
                <h4 className="text-primary-foreground mb-2">Compromiso</h4>
                <p className="text-primary-foreground/80">
                  Dedicados al desarrollo profesional continuo
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-8 h-8 text-accent-foreground" />
                </div>
                <h4 className="text-primary-foreground mb-2">Responsabilidad</h4>
                <p className="text-primary-foreground/80">
                  Compromiso con la sociedad y el medio ambiente
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-3 text-foreground">Nuestros Servicios</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ofrecemos una amplia gama de servicios para apoyar el desarrollo profesional de nuestros colegiados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-foreground">Últimas Noticias</h2>
            <Button
              onClick={() => navigate('/noticias')}
              variant="outline"
            >
              Ver Todas
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-primary/10">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1748345952129-3bdd7d39f155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMHRlYW0lMjBvZmZpY2V8ZW58MXx8fHwxNzYxMTYzNzQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Noticia"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Convocatoria Asamblea General {item}</CardTitle>
                  <CardDescription>22 de octubre, 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Se convoca a todos los miembros del colegio a la asamblea general ordinaria...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="mb-3">Contacto</h3>
              <p>Av. Arce #123, La Paz, Bolivia</p>
              <p>Teléfono: +591 2 1234567</p>
              <p>Email: info@cicb.org.bo</p>
            </div>
            <div>
              <h3 className="mb-3">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate('/reglamentos')} className="hover:text-accent">
                    Reglamentos
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/convocatorias')} className="hover:text-accent">
                    Convocatorias
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/trabajos')} className="hover:text-accent">
                    Trabajos
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3">Horario de Atención</h3>
              <p>Lunes a Viernes: 8:00 - 18:00</p>
              <p>Sábados: 9:00 - 13:00</p>
              <p>Domingos: Cerrado</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center">
            <p>&copy; 2025 Colegio de Ingenieros Civiles de Bolivia. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
