import { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Button } from './ui/button';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'jobs', label: 'Trabajos' },
    { id: 'news', label: 'Noticias' },
    { id: 'table', label: 'Tabla' },
    { id: 'yearbook', label: 'Anuario' },
    { id: 'regulations', label: 'Reglamentos' },
    { id: 'announcements', label: 'Convocatorias' },
  ];

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <span className="text-accent-foreground">CICB</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-primary-foreground">Colegio de Ingenieros Civiles de Bolivia</h1>
            </div>
            <div className="md:hidden">
              <h1 className="text-primary-foreground">CICB</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded transition-colors ${
                  currentPage === item.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-primary/80'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => onNavigate('profile')}
              className={`ml-2 px-4 py-2 rounded flex items-center space-x-2 transition-colors ${
                currentPage === 'profile'
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-primary/80'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Mi Perfil</span>
            </button>
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
                  onNavigate(item.id);
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
                onNavigate('profile');
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 rounded flex items-center space-x-2 transition-colors ${
                currentPage === 'profile'
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
