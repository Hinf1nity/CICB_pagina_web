import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { NewsPage } from './components/NewsPage';
import { JobsPage } from './components/JobsPage';
import { NewsDetailPage } from './components/NewsDetailPage';
import { JobDetailPage } from './components/JobDetailPage';
import { UserProfilePage } from './components/UserProfilePage';
import { TablePage } from './components/TablePage';
import { AdminNewsPage } from './components/AdminNewsPage';
import { AdminUsersPage } from './components/AdminUsersPage';
import { GenericPage } from './components/GenericPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);

  const handleNavigate = (page: string, id?: number) => {
    setCurrentPage(page);
    setSelectedId(id);
  };
    const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'news':
        return <NewsPage onNavigate={handleNavigate} />;
      case 'news-detail':
        return <NewsDetailPage newsId={selectedId || 1} onNavigate={handleNavigate} />;
      case 'jobs':
        return <JobsPage onNavigate={handleNavigate} />;
      case 'job-detail':
        return <JobDetailPage jobId={selectedId || 1} onNavigate={handleNavigate} />;
      case 'profile':
        return <UserProfilePage />;
      case 'table':
        return <TablePage />;
      case 'admin-news':
        return <AdminNewsPage />;
      case 'admin-users':
        return <AdminUsersPage />;
      case 'yearbook':
        return (
          <GenericPage
            title="Anuario"
            description="Consulta los anuarios de miembros del Colegio de Ingenieros Civiles"
            type="yearbook"
          />
        );
      case 'regulations':
        return (
          <GenericPage
            title="Reglamentos"
            description="Accede a los reglamentos y normativas del CICB"
            type="regulations"
          />
        );
      case 'announcements':
        return (
          <GenericPage
            title="Convocatorias"
            description="Mantente informado sobre las convocatorias oficiales del colegio"
            type="announcements"
          />
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
      
      {/* Admin Access Button - Only for demonstration */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setCurrentPage('admin-news')}
          className="bg-accent text-accent-foreground px-4 py-2 rounded-lg shadow-lg hover:bg-accent/90 transition-colors"
        >
          Admin: Noticias
        </button>
        <button
          onClick={() => setCurrentPage('admin-users')}
          className="bg-accent text-accent-foreground px-4 py-2 rounded-lg shadow-lg hover:bg-accent/90 transition-colors"
        >
          Admin: Usuarios
        </button>
      </div>
    </div>
  );
}
