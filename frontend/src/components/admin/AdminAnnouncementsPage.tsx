import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Megaphone, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Calendar,
  Download,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface Announcement {
  id: number;
  code: string;
  title: string;
  description: string;
  type: string;
  entity: string;
  location: string;
  budget: string;
  deadline: string;
  publishDate: string;
  status: 'active' | 'closed' | 'draft';
  contactEmail: string;
  contactPhone: string;
  documentUrl: string;
  requirements: string;
}

export function AdminAnnouncementsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  
  const types = [
    'Licitación Pública',
    'Convocatoria de Personal',
    'Concurso de Proyectos',
    'Consultoría',
    'Capacitación',
    'Llamado a Propuestas'
  ];

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      code: 'CONV-001-2024',
      title: 'Licitación para Diseño de Puente Vehicular - La Paz',
      description: 'Convocatoria pública para el diseño estructural y arquitectónico de puente vehicular sobre el río La Paz, con una longitud aproximada de 120 metros',
      type: 'Licitación Pública',
      entity: 'Gobierno Autónomo Municipal de La Paz',
      location: 'La Paz, Bolivia',
      budget: 'Bs. 2,500,000',
      deadline: '2024-12-30',
      publishDate: '2024-12-01',
      status: 'active',
      contactEmail: 'licitaciones@lapaz.gob.bo',
      contactPhone: '+591 2 2650000',
      documentUrl: '',
      requirements: 'Registro CICB vigente, experiencia mínima 5 años en diseño de puentes'
    },
    {
      id: 2,
      code: 'CONV-002-2024',
      title: 'Consultoría para Estudios de Impacto Ambiental',
      description: 'Se requiere consultoría para la elaboración de estudios de impacto ambiental para proyecto vial departamental',
      type: 'Consultoría',
      entity: 'Prefectura del Departamento de Santa Cruz',
      location: 'Santa Cruz, Bolivia',
      budget: 'Bs. 850,000',
      deadline: '2024-12-25',
      publishDate: '2024-11-15',
      status: 'active',
      contactEmail: 'consultoria@santacruz.gob.bo',
      contactPhone: '+591 3 3636300',
      documentUrl: '',
      requirements: 'Ingeniero Civil especializado en medio ambiente, registro CICB activo'
    },
    {
      id: 3,
      code: 'CONV-003-2024',
      title: 'Convocatoria Ingeniero Residente de Obra',
      description: 'Se requiere ingeniero civil para supervisión y residencia de obra de construcción de edificio educativo de 3 plantas',
      type: 'Convocatoria de Personal',
      entity: 'Ministerio de Educación',
      location: 'Cochabamba, Bolivia',
      budget: 'Bs. 12,000/mes',
      deadline: '2024-12-20',
      publishDate: '2024-12-05',
      status: 'active',
      contactEmail: 'rrhh@minedu.gob.bo',
      contactPhone: '+591 4 4251000',
      documentUrl: '',
      requirements: 'Título en provisión nacional, experiencia mínima 3 años, disponibilidad inmediata'
    },
    {
      id: 4,
      code: 'CONV-004-2024',
      title: 'Concurso de Diseño Urbano - Plaza Central',
      description: 'Concurso público para el diseño arquitectónico y urbano de la remodelación de la Plaza Central de la ciudad',
      type: 'Concurso de Proyectos',
      entity: 'Alcaldía de Tarija',
      location: 'Tarija, Bolivia',
      budget: 'Bs. 450,000',
      deadline: '2024-11-30',
      publishDate: '2024-10-01',
      status: 'closed',
      contactEmail: 'proyectos@tarija.gob.bo',
      contactPhone: '+591 4 6644000',
      documentUrl: '',
      requirements: 'Equipo multidisciplinario, experiencia en proyectos urbanos'
    },
    {
      id: 5,
      code: 'CONV-005-2025',
      title: 'Curso Especializado en BIM para Ingeniería Civil',
      description: 'Convocatoria para curso de capacitación en metodología BIM aplicada a proyectos de ingeniería civil',
      type: 'Capacitación',
      entity: 'Colegio de Ingenieros Civiles de Bolivia',
      location: 'Modalidad Virtual',
      budget: 'Bs. 800 (inversión del participante)',
      deadline: '2025-01-15',
      publishDate: '2024-12-10',
      status: 'active',
      contactEmail: 'capacitacion@cicb.org.bo',
      contactPhone: '+591 2 2441122',
      documentUrl: '',
      requirements: 'Miembros activos del CICB, conocimientos básicos de CAD'
    }
  ]);

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    type: types[0],
    entity: '',
    location: '',
    budget: '',
    deadline: new Date().toISOString().split('T')[0],
    publishDate: new Date().toISOString().split('T')[0],
    status: 'draft' as 'active' | 'closed' | 'draft',
    contactEmail: '',
    contactPhone: '',
    documentUrl: '',
    requirements: ''
  });

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta convocatoria?')) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      code: announcement.code,
      title: announcement.title,
      description: announcement.description,
      type: announcement.type,
      entity: announcement.entity,
      location: announcement.location,
      budget: announcement.budget,
      deadline: announcement.deadline,
      publishDate: announcement.publishDate,
      status: announcement.status,
      contactEmail: announcement.contactEmail,
      contactPhone: announcement.contactPhone,
      documentUrl: announcement.documentUrl,
      requirements: announcement.requirements
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingAnnouncement) {
      setAnnouncements(announcements.map(a => 
        a.id === editingAnnouncement.id 
          ? { ...formData, id: editingAnnouncement.id }
          : a
      ));
    } else {
      const newAnnouncement: Announcement = {
        ...formData,
        id: Math.max(...announcements.map(a => a.id)) + 1
      };
      setAnnouncements([newAnnouncement, ...announcements]);
    }
    
    setIsDialogOpen(false);
    setEditingAnnouncement(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      type: types[0],
      entity: '',
      location: '',
      budget: '',
      deadline: new Date().toISOString().split('T')[0],
      publishDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      contactEmail: '',
      contactPhone: '',
      documentUrl: '',
      requirements: ''
    });
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.publishDate.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-[#3C8D50] text-white';
      case 'draft': return 'bg-yellow-500 text-white';
      case 'closed': return 'bg-gray-500 text-white';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return 'Activa';
      case 'draft': return 'Borrador';
      case 'closed': return 'Cerrada';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-4 text-primary-foreground hover:bg-primary/80"
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Panel
          </Button>
          <div className="flex items-center gap-3 mb-3">
            <Megaphone className="w-10 h-10" />
            <h1>Gestión de Convocatorias</h1>
          </div>
          <p>Administra convocatorias, licitaciones y llamados oficiales del CICB</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar convocatorias por título o fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-primary text-primary-foreground"
                onClick={() => {
                  setEditingAnnouncement(null);
                  resetForm();
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Convocatoria
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAnnouncement ? 'Editar Convocatoria' : 'Crear Nueva Convocatoria'}
                </DialogTitle>
                <DialogDescription>
                  {editingAnnouncement 
                    ? 'Actualiza la información de la convocatoria' 
                    : 'Completa la información para crear una nueva convocatoria'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Título de la convocatoria..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descripción detallada de la convocatoria..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="publishDate">Fecha de Publicación</Label>
                    <Input
                      id="publishDate"
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => setFormData({...formData, publishDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'active' | 'closed' | 'draft') => 
                        setFormData({...formData, status: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Borrador</SelectItem>
                        <SelectItem value="active">Activa</SelectItem>
                        <SelectItem value="closed">Cerrada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
                  {editingAnnouncement ? 'Actualizar' : 'Crear'} Convocatoria
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Total</p>
                  <p className="text-3xl">{announcements.length}</p>
                </div>
                <Megaphone className="w-8 h-8 text-[#0B3D2E]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Activas</p>
                  <p className="text-3xl">
                    {announcements.filter(a => a.status === 'active').length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-[#3C8D50]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Borradores</p>
                  <p className="text-3xl">
                    {announcements.filter(a => a.status === 'draft').length}
                  </p>
                </div>
                <Edit className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Cerradas</p>
                  <p className="text-3xl">
                    {announcements.filter(a => a.status === 'closed').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements List */}
        <Card>
          <CardHeader>
            <CardTitle>Convocatorias Registradas</CardTitle>
            <CardDescription>
              {filteredAnnouncements.length} convocatoria(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-foreground">{announcement.title}</h3>
                        <Badge className={getStatusColor(announcement.status)}>
                          {getStatusLabel(announcement.status)}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{announcement.description}</p>

                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Fecha de Publicación: {new Date(announcement.deadline).toLocaleDateString('es-BO')}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {announcement.documentUrl && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Doc
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(announcement.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredAnnouncements.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No se encontraron convocatorias</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
