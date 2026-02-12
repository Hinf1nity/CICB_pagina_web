import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { AdminJobsManager } from './AdminJobsManager';
import { useNavigate } from 'react-router-dom';

export function AdminJobsPage() {
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
          <h1 className="text-3xl font-bold mb-3">Gestión de Trabajos</h1>
          <p>Administra las ofertas laborales publicadas en el portal</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdminJobsManager />
      </div>
    </div>
  );
}
