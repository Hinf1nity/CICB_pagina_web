import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { AdminUsersManager } from './AdminUsersManager.tsx';
import { useNavigate } from 'react-router-dom';

export function AdminUsersPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Panel
          </Button>
          <h1 className="mb-3">Gestión de Usuarios</h1>
          <p>Administra los perfiles de los miembros del colegio</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdminUsersManager />
      </div>
    </div>
  );
}
