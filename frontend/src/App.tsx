import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { NewsPage } from './components/NewsPage';
import { JobsPage } from './components/JobsPage';
import { NewsDetailPage } from './components/NewsDetailPage';
import { JobDetailPage } from './components/JobDetailPage';
import { UserProfilePage } from './components/UserProfilePage';
import { TablePage } from './components/TablePage';
import { StatsPage } from './components/StatsPage';
import { AdminNewsPage } from './components/AdminNewsPage';
import { AdminUsersPage } from './components/AdminUsersPage';
import { GenericPage } from './components/GenericPage';

export default function App() {
  // const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
        {/* Admin Access Button - Only for demonstration */}
        {/* <div className="fixed bottom-4 right-4 flex flex-col gap-2">
          <button
            // onClick={() => navigate('/admin/noticias')}
            className="bg-accent text-accent-foreground px-4 py-2 rounded-lg shadow-lg hover:bg-accent/90 transition-colors"
          >
            Admin: Noticias
          </button>
          <button
            // onClick={() => navigate('/admin/usuarios')}
            className="bg-accent text-accent-foreground px-4 py-2 rounded-lg shadow-lg hover:bg-accent/90 transition-colors"
          >
            Admin: Usuarios
          </button>
        </div> */}
      </BrowserRouter>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/noticias" element={<NewsPage />} />
      <Route path="/noticias/:id" element={<NewsDetailPage />} />
      <Route path="/trabajos" element={<JobsPage />} />
      <Route path="/trabajos/:id" element={<JobDetailPage />} />
      <Route path="/perfil" element={<UserProfilePage />} />
      <Route path="/tabla" element={<TablePage />} />
      <Route path="/estadisticas" element={<StatsPage />} />
      <Route path="/admin/noticias" element={<AdminNewsPage />} />
      <Route path="/admin/usuarios" element={<AdminUsersPage />} />
      <Route path="/anuario" element={
        <GenericPage
          title="Anuario"
          description="Consulta los anuarios de miembros del Colegio de Ingenieros Civiles"
          type="yearbook"
        />
      } />
      <Route path="/reglamentos" element={
        <GenericPage
          title="Reglamentos"
          description="Accede a los reglamentos y normativas del CICB"
          type="regulations"
        />
      } />
      <Route path="/convocatorias" element={
        <GenericPage
          title="Convocatorias"
          description="Mantente informado sobre las convocatorias oficiales del colegio"
          type="announcements"
        />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}