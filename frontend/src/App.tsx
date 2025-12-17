import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { NewsPage } from './components/NewsPage';
import { JobsPage } from './components/JobsPage';
import { NewsDetailPage } from './components/NewsDetailPage';
import { JobDetailPage } from './components/JobDetailPage';
import { LoginPage } from './components/LoginPage';
import { UserProfilePage } from './components/UserProfilePage';
import { UserCardPage } from './components/UserCardPage';
import { TablePage } from './components/TablePage';
import { StatsPage } from './components/StatsPage';
import { AdminDashboard } from './components/AdminDashboard';
import { GenericPage } from './components/GenericPage';
import { AdminUsersPage } from './components/admin/AdminUsersPage';
import { AdminPerformancePage } from './components/admin/AdminPerformancePage';
import { AdminJobsPage } from './components/admin/AdminJobsPage';
import { AdminNewsPage } from './components/admin/AdminNewsPage';
import { AdminAnnouncementsPage } from './components/admin/AdminAnnouncementsPage';
import { AdminRegulationsPage } from './components/admin/AdminRegulationsPage';
import { AdminYearbookPage } from './components/admin/AdminYearbookPage';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  // const navigate = useNavigate();

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const location = useLocation();
  const currentPath = location.pathname;

  const shouldShowNavbar = 
    currentPath !== '/login' && 
    !currentPath.startsWith('/tarjeta_usuario') && 
    !currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background">
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/noticias" element={<NewsPage />} />
        <Route path="/noticias/:id" element={<NewsDetailPage />} />
        <Route path="/trabajos" element={<JobsPage />} />
        <Route path="/trabajos/:id" element={<JobDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/perfil" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
        <Route path="/tarjeta_usuario/:id" element={<UserCardPage />} />
        <Route path="/tabla" element={<TablePage />} />
        <Route path="/estadisticas" element={<StatsPage />} />
        <Route path="/admin" element={
          <PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/usuarios" element={
          <PrivateRoute><AdminUsersPage /></PrivateRoute>} />
        <Route path="/admin/noticias" element={
          <PrivateRoute><AdminNewsPage /></PrivateRoute>} />
        <Route path="/admin/trabajos" element={<PrivateRoute><AdminJobsPage /></PrivateRoute>} />
        <Route path="/admin/rendimientos" element={<PrivateRoute><AdminPerformancePage /></PrivateRoute>} />
        <Route path="/admin/convocatorias" element={<PrivateRoute><AdminAnnouncementsPage /></PrivateRoute>} />
        <Route path="/admin/regulaciones" element={<PrivateRoute><AdminRegulationsPage /></PrivateRoute>} />
        <Route path="/admin/anuario" element={<PrivateRoute><AdminYearbookPage /></PrivateRoute>} />
        <Route path="/anuario" element={
          <GenericPage
            title="Anuario"
            description="Consulta los anuarios de miembros del Colegio de Ingenieros Civiles"
            type="yearbooks"
          />
        } />
        <Route path="/reglamentos" element={
          <GenericPage
            title="Reglamentos"
            description="Accede a los reglamentos y normativas del CICB"
            type="regulation"
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
    </div>
  );
}