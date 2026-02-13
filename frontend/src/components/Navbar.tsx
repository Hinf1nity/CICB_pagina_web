import { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { Menu, User, LogIn, LogOut, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../auth/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from './ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, hasPermission, user } = useAuth();

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    setCurrentPage(path || 'home');
  }, [location]);

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/trabajos', label: 'Trabajos' },
    { path: '/noticias', label: 'Noticias' },
    { path: '/estadisticas', label: 'Estadísticas' },
    { path: '/tabla', label: 'Tabla' },
    { path: '/anuario', label: 'Anuario' },
    { path: '/normativa', label: 'Normativa' },
    { path: '/convocatorias', label: 'Convocatorias' },
  ];

  const profileButtonLabel = () => {
    if (isAuthenticated) {
      if (hasPermission("users.read")) {
        return `Ing. ${user?.name}`;
      }
      if (hasPermission("admin.access")) {
        return "Administración General";
      }
      if (hasPermission("admin.users.manage")) {
        return "Administración Departamental";
      }
    }
    return "Iniciar Sesión";
  }

  const profileLabel = () => {
    if (isAuthenticated) {
      if (hasPermission("users.read")) {
        return "Mi Perfil";
      }
      if (hasPermission("admin.access")) {
        return "Panel de Administración";
      }
      if (hasPermission("admin.users.manage")) {
        return "Gestión de Colegiados";
      }
    }
    return "Iniciar Sesión";
  }

  const profileRoute = () => {
    if (hasPermission("users.read")) {
      return '/perfil';
    }
    if (hasPermission("admin.access")) {
      return '/admin';
    }
    if (hasPermission("admin.users.manage")) {
      return '/admin/usuarios';
    }
    return '/login';
  }
  const ProfileIcon = isAuthenticated ? User : LogIn;

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <NavLink to="/" className="flex items-center space-x-3 shrink-0">
            <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-full bg-white shrink-0">
              <img src="/cicImages/logo_cicb_sin_fondo.png" alt="Logo CICB" className="w-full h-full object-contain" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-primary-foreground font-semibold text-lg">
                Colegio de Ingenieros Civiles de Bolivia
              </h1>
            </div>
            <div className="md:hidden">
              <h1 className="text-primary-foreground font-semibold text-lg">CICB</h1>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden 2xl:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(`${item.path}`)}
                className={`px-4 py-2 rounded transition-colors cursor-pointer ${currentPage === item.path
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-primary/80'
                  }`}
              >
                {item.label}
              </Button>
            ))}
            {isAuthenticated ? (
              <>
                {/* Dropdown Menu para Perfil */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className={`ml-2 px-4 py-2 rounded flex items-center space-x-2 transition-colors ${location.pathname === '/perfil'
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-primary/80'
                        }`}
                    >
                      <User className="w-4 h-4" />
                      <span>{profileLabel()}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <NavLink to={profileRoute()} className="flex items-center cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        <span>{profileButtonLabel()}</span>
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) :
              (
                <Button
                  onClick={() => navigate('/login')}
                  className={`ml-2 px-4 py-2 rounded flex items-center space-x-2 transition-colors cursor-pointer ${currentPage === 'perfil' || currentPage === 'login'
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-primary/80'
                    }`}
                >
                  <ProfileIcon className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                </Button>
              )}
          </div>

          {/* Mobile menu button - usando Sheet */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button className="2xl:hidden p-2 rounded hover:bg-primary/80">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="sr-only">
                <SheetTitle>Menú de Navegación</SheetTitle>
                <SheetDescription>
                  Accede a las diferentes secciones del Colegio de Ingenieros Civiles de Bolivia.
                </SheetDescription>
              </div>
              <div className="flex flex-col h-full">
                {/* Header del drawer con info del usuario */}
                <div className="bg-primary text-primary-foreground p-6">
                  {isAuthenticated ? (
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16 border-2 border-accent">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-accent text-accent-foreground text-lg">
                          {profileButtonLabel().split(' ').map(n => n[0]).join('').slice(1, 3)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{profileButtonLabel()}</h3>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <Button onClick={() => navigate('/login')}>Iniciar Sesión <LogIn className="w-4 h-4" /></Button>
                    </div>
                  )}
                </div>

                {/* Navegación principal */}
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="px-4 mb-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Navegación
                    </h4>
                  </div>

                  <nav className="space-y-1 px-2">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-foreground hover:bg-muted'
                          }`}
                      >
                        <span>{item.label}</span>
                        {isActive(item.path) && <ChevronRight className="w-4 h-4" />}
                      </NavLink>
                    ))}
                  </nav>
                  {(isAuthenticated) && (
                    <>
                      <Separator className="my-4" />

                      {/* Opciones de perfil */}
                      <div className="px-4 mb-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Cuenta
                        </h4>
                      </div>

                      <div className="space-y-1 px-2">
                        <NavLink
                          to={profileRoute()}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${location.pathname === profileRoute()
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-foreground hover:bg-muted'
                            }`}
                        >
                          <div className="flex items-center space-x-3">
                            <User className="w-5 h-5" />
                            <span>{profileLabel()}</span>
                          </div>
                          {location.pathname === profileRoute() && <ChevronRight className="w-4 h-4" />}
                        </NavLink>

                        <button
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Footer del drawer */}
                <div className="border-t border-border p-4">
                  <p className="text-xs text-center text-muted-foreground">
                    © 2024 CICB - Colegio de Ingenieros Civiles de Bolivia
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
