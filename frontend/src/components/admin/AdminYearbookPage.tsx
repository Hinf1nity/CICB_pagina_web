import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Calendar,
  Download,
  Eye,
  ArrowLeft
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

interface Yearbook {
  id: number;
  year: number;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  publishDate: string;
  status: 'published' | 'draft';
  members: number;
  pages: number;
}

export function AdminYearbookPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingYearbook, setEditingYearbook] = useState<Yearbook | null>(null);
  
  const [yearbooks, setYearbooks] = useState<Yearbook[]>([
    {
      id: 1,
      year: 2024,
      title: 'Anuario CICB 2024',
      description: 'Anuario oficial del Colegio de Ingenieros Civiles de Bolivia correspondiente al año 2024',
      coverImage: '',
      pdfUrl: '',
      publishDate: '2024-12-01',
      status: 'published',
      members: 156,
      pages: 120
    },
    {
      id: 2,
      year: 2023,
      title: 'Anuario CICB 2023',
      description: 'Anuario oficial del Colegio de Ingenieros Civiles de Bolivia correspondiente al año 2023',
      coverImage: '',
      pdfUrl: '',
      publishDate: '2023-12-15',
      status: 'published',
      members: 142,
      pages: 108
    },
    {
      id: 3,
      year: 2025,
      title: 'Anuario CICB 2025',
      description: 'Anuario en preparación para el año 2025',
      coverImage: '',
      pdfUrl: '',
      publishDate: '2025-01-01',
      status: 'draft',
      members: 0,
      pages: 0
    }
  ]);

  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    title: '',
    description: '',
    coverImage: '',
    pdfUrl: '',
    publishDate: new Date().toISOString().split('T')[0],
    status: 'draft' as 'published' | 'draft',
    members: 0,
    pages: 0
  });

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este anuario?')) {
      setYearbooks(yearbooks.filter(y => y.id !== id));
    }
  };

  const handleEdit = (yearbook: Yearbook) => {
    setEditingYearbook(yearbook);
    setFormData({
      year: yearbook.year,
      title: yearbook.title,
      description: yearbook.description,
      coverImage: yearbook.coverImage,
      pdfUrl: yearbook.pdfUrl,
      publishDate: yearbook.publishDate,
      status: yearbook.status,
      members: yearbook.members,
      pages: yearbook.pages
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingYearbook) {
      setYearbooks(yearbooks.map(y => 
        y.id === editingYearbook.id 
          ? { ...formData, id: editingYearbook.id }
          : y
      ));
    } else {
      const newYearbook: Yearbook = {
        ...formData,
        id: Math.max(...yearbooks.map(y => y.id)) + 1
      };
      setYearbooks([newYearbook, ...yearbooks]);
    }
    
    setIsDialogOpen(false);
    setEditingYearbook(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      year: new Date().getFullYear(),
      title: '',
      description: '',
      coverImage: '',
      pdfUrl: '',
      publishDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      members: 0,
      pages: 0
    });
  };

  const filteredYearbooks = yearbooks.filter(yearbook =>
    yearbook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    yearbook.year.toString().includes(searchTerm)
  );

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
            <BookOpen className="w-10 h-10" />
            <h1>Gestión de Anuarios</h1>
          </div>
          <p>Administra los anuarios anuales del Colegio de Ingenieros Civiles de Bolivia</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar anuarios por año o título..."
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
                  setEditingYearbook(null);
                  resetForm();
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Anuario
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingYearbook ? 'Editar Anuario' : 'Crear Nuevo Anuario'}
                </DialogTitle>
                <DialogDescription>
                  {editingYearbook 
                    ? 'Actualiza la información del anuario' 
                    : 'Completa la información para crear un nuevo anuario'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Anuario CICB 2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descripción del anuario..."
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
                      onValueChange={(value: 'published' | 'draft') => 
                        setFormData({...formData, status: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Borrador</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
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
                  {editingYearbook ? 'Actualizar' : 'Crear'} Anuario
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
                  <p className="text-muted-foreground mb-1">Total Anuarios</p>
                  <p className="text-3xl">{yearbooks.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-[#0B3D2E]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Publicados</p>
                  <p className="text-3xl">
                    {yearbooks.filter(y => y.status === 'published').length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-[#1B5E3A]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Borradores</p>
                  <p className="text-3xl">
                    {yearbooks.filter(y => y.status === 'draft').length}
                  </p>
                </div>
                <Edit className="w-8 h-8 text-[#3C8D50]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Año Actual</p>
                  <p className="text-3xl">{new Date().getFullYear()}</p>
                </div>
                <Calendar className="w-8 h-8 text-[#3A5A78]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Yearbooks List */}
        <Card>
          <CardHeader>
            <CardTitle>Anuarios Registrados</CardTitle>
            <CardDescription>
              {filteredYearbooks.length} anuario(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredYearbooks.map((yearbook) => (
                <div
                  key={yearbook.id}
                  className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-foreground">{yearbook.title}</h3>
                        <Badge 
                          variant={yearbook.status === 'published' ? 'default' : 'secondary'}
                          className={yearbook.status === 'published' 
                            ? 'bg-[#3C8D50] text-white' 
                            : ''
                          }
                        >
                          {yearbook.status === 'published' ? 'Publicado' : 'Borrador'}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{yearbook.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-muted-foreground">
                        <span>
                          Publicado: {new Date(yearbook.publishDate).toLocaleDateString('es-BO')}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {yearbook.pdfUrl && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          PDF
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(yearbook)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(yearbook.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredYearbooks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No se encontraron anuarios</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
