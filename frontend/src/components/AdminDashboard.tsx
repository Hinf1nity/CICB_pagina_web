import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Users, Newspaper, Briefcase, ListChecks, ArrowRight, Settings, FileText, BookOpen, Megaphone, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const adminSections = [
    {
      id: '/admin/usuarios',
      title: 'Gestión de Usuarios',
      description: 'Administra perfiles, roles y estados de los miembros del colegio',
      icon: Users,
      color: 'text-[#0B3D2E]',
      bgColor: 'bg-[#0B3D2E]/10',
      stats: '156 usuarios registrados'
    },
    {
      id: '/admin/noticias',
      title: 'Gestión de Noticias',
      description: 'Publica y edita noticias, comunicados y artículos del portal',
      icon: Newspaper,
      color: 'text-[#1B5E3A]',
      bgColor: 'bg-[#1B5E3A]/10',
      stats: '24 noticias publicadas'
    },
    {
      id: '/admin/trabajos',
      title: 'Gestión de Trabajos',
      description: 'Administra ofertas laborales y oportunidades profesionales',
      icon: Briefcase,
      color: 'text-[#3C8D50]',
      bgColor: 'bg-[#3C8D50]/10',
      stats: '18 trabajos activos'
    },
    {
      id: '/admin/rendimientos',
      title: 'Gestión de Rendimientos',
      description: 'Actualiza la tabla de rendimientos de actividades de construcción',
      icon: ListChecks,
      color: 'text-[#3A5A78]',
      bgColor: 'bg-[#3A5A78]/10',
      stats: '142 actividades registradas'
    },
    {
      id: "/admin/anuario",
      title: "Gestión de Anuario",
      description:
        "Administra el anuario anual de ingenieros colegiados y eventos",
      icon: BookOpen,
      color: "text-[#0B3D2E]",
      bgColor: "bg-[#0B3D2E]/10",
      stats: "3 anuarios publicados",
    },
    {
      id: "/admin/regulaciones",
      title: "Gestión de Reglamentos",
      description:
        "Publica y actualiza reglamentos, normativas y documentos oficiales",
      icon: FileText,
      color: "text-[#1B5E3A]",
      bgColor: "bg-[#1B5E3A]/10",
      stats: "15 reglamentos vigentes",
    },
    {
      id: "/admin/convocatorias",
      title: "Gestión de Convocatorias",
      description:
        "Administra convocatorias, licitaciones y llamados oficiales",
      icon: Megaphone,
      color: "text-[#3C8D50]",
      bgColor: "bg-[#3C8D50]/10",
      stats: "8 convocatorias activas",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-start mb-4">
            <div className='flex items-center gap-3'>
              <Settings className="w-12 h-12" />
              <h1>Panel de Administración</h1>
            </div>
            <Button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
          <p className="text-lg">Gestiona todo el contenido y usuarios del portal del Colegio de Ingenieros Civiles de Bolivia</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-background border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Usuarios Totales</p>
                  <p className="text-3xl">156</p>
                </div>
                <Users className="w-8 h-8 text-[#0B3D2E]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Noticias Activas</p>
                  <p className="text-3xl">24</p>
                </div>
                <Newspaper className="w-8 h-8 text-[#1B5E3A]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Trabajos Publicados</p>
                  <p className="text-3xl">18</p>
                </div>
                <Briefcase className="w-8 h-8 text-[#3C8D50]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">
                    Reglamentos
                  </p>
                  <p className="text-3xl">8</p>
                </div>
                <FileText className="w-8 h-8 text-[#3A5A78]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div className="pb-12">
          <h2 className="mb-8">Secciones Administrativas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section) => {
              const Icon = section.icon;
              return (
                <Card
                  key={section.id}
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-primary"
                  onClick={() => navigate(section.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${section.bgColor} mb-4`}>
                        <Icon className={`w-8 h-8 ${section.color}`} />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription className="mt-2">{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground">{section.stats}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group-hover:bg-primary/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(section.id);
                        }}
                      >
                        Administrar
                      </Button>
                    </div>
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
