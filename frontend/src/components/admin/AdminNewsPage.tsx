import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { AdminNewsManager } from './AdminNewsManager';
import { useNavigate } from 'react-router-dom';

export function AdminNewsPage() {
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
          <h1 className="mb-3">Gestión de Noticias</h1>
          <p>Administra las noticias y artículos publicados en el portal</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdminNewsManager />
      </div>
    </div>
  );
}
