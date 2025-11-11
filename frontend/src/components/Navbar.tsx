import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from './ui/button';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    setCurrentPage(path || 'home');
  }, [location]);

  const navItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'trabajos', label: 'Trabajos' },
    { id: 'noticias', label: 'Noticias' },
    { id: 'estadisticas', label: 'Estadísticas' },
    { id: 'tabla', label: 'Tabla' },
    { id: 'anuario', label: 'Anuario' },
    { id: 'reglamentos', label: 'Reglamentos' },
    { id: 'convocatorias', label: 'Convocatorias' },
  ];

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={()=>navigate('/')}>
            <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-full bg-white">
              <img src="/src/assets/LOGO CIC B sin fondo.png" alt="Logo CICB" className="w-full h-full object-contain"/>
          </div>
          <div className="hidden md:block">
            <h1 className="text-primary-foreground font-semibold text-lg">
              Colegio de Ingenieros Civiles de Bolivia
            </h1>
          </div>
          <div className="md:hidden">
            <h1 className="text-primary-foreground font-semibold text-lg">CICB</h1>
          </div>
        </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => navigate(`/${item.id}`)}
                className={`px-4 py-2 rounded transition-colors cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-primary/80'
                }`}
              >
                {item.label}
              </Button>
            ))}
            <Button
              onClick={() => navigate('/perfil')}
              className={`ml-2 px-4 py-2 rounded flex items-center space-x-2 transition-colors cursor-pointer ${
                currentPage === 'perfil'
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-primary/80'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Mi Perfil</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded hover:bg-primary/80"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(`/${item.id}`);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                  currentPage === item.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-primary/80'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                navigate('/perfil');
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 rounded flex items-center space-x-2 transition-colors ${
                currentPage === 'perfil'
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-primary/80'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Mi Perfil</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
