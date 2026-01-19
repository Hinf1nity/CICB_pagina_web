import { Button } from '../ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { AdminUsersManager } from './AdminUsersManager.tsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth.ts';

export function AdminUsersPage() {
  const navigate = useNavigate();
  const { hasPermission, logout } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          {hasPermission("admin.access") && (
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="mb-4 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Panel
            </Button>
          )}
          {hasPermission("admin.users.manage") && (
            <Button
              variant="ghost"
              onClick={() => logout()}
              className="mb-4 bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          )}
          <h1 className="text-3xl font-bold mb-3">Gestión de Colegiados</h1>
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
