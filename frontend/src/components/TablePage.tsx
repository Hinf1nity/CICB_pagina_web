import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Search, Download, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function TablePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterCity, setFilterCity] = useState('all');

  const members = [
    { id: 1, name: 'Juan Carlos Pérez', registration: 'CICB-LP-1234', specialty: 'Estructural', city: 'La Paz', status: 'Activo', phone: '70123456' },
    { id: 2, name: 'María Elena Torres', registration: 'CICB-SC-2345', specialty: 'Hidráulica', city: 'Santa Cruz', status: 'Activo', phone: '71234567' },
    { id: 3, name: 'Roberto Sánchez', registration: 'CICB-CB-3456', specialty: 'Vial', city: 'Cochabamba', status: 'Activo', phone: '72345678' },
    { id: 4, name: 'Ana Gabriela Morales', registration: 'CICB-LP-4567', specialty: 'Geotecnia', city: 'La Paz', status: 'Activo', phone: '73456789' },
    { id: 5, name: 'Luis Fernando Ramos', registration: 'CICB-TJ-5678', specialty: 'Estructural', city: 'Tarija', status: 'Activo', phone: '74567890' },
    { id: 6, name: 'Patricia Guzmán', registration: 'CICB-SC-6789', specialty: 'Ambiental', city: 'Santa Cruz', status: 'Activo', phone: '75678901' },
    { id: 7, name: 'Diego Alvarado', registration: 'CICB-LP-7890', specialty: 'Construcción', city: 'La Paz', status: 'Activo', phone: '76789012' },
    { id: 8, name: 'Carmen Flores', registration: 'CICB-OR-8901', specialty: 'Vial', city: 'Oruro', status: 'Activo', phone: '77890123' },
    { id: 9, name: 'Javier Mendoza', registration: 'CICB-PT-9012', specialty: 'Hidráulica', city: 'Potosí', status: 'Activo', phone: '78901234' },
    { id: 10, name: 'Sofía Vargas', registration: 'CICB-CB-0123', specialty: 'Estructural', city: 'Cochabamba', status: 'Activo', phone: '79012345' },
    { id: 11, name: 'Andrés Quiroga', registration: 'CICB-LP-1235', specialty: 'Sanitaria', city: 'La Paz', status: 'Activo', phone: '70234561' },
    { id: 12, name: 'Valeria Ríos', registration: 'CICB-SC-2346', specialty: 'Transporte', city: 'Santa Cruz', status: 'Activo', phone: '71345672' },
  ];

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === 'all' || member.specialty === filterSpecialty;
    const matchesCity = filterCity === 'all' || member.city === filterCity;
    return matchesSearch && matchesSpecialty && matchesCity;
  });

  const handleExport = () => {
    // Lógica para exportar a CSV
    console.log('Exportando datos...');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="mb-3">Directorio de Miembros</h1>
          <p>Consulta el registro de ingenieros civiles colegiados en Bolivia</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-muted py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por nombre, registro o especialidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Especialidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las especialidades</SelectItem>
                <SelectItem value="Estructural">Estructural</SelectItem>
                <SelectItem value="Hidráulica">Hidráulica</SelectItem>
                <SelectItem value="Vial">Vial</SelectItem>
                <SelectItem value="Geotecnia">Geotecnia</SelectItem>
                <SelectItem value="Ambiental">Ambiental</SelectItem>
                <SelectItem value="Construcción">Construcción</SelectItem>
                <SelectItem value="Sanitaria">Sanitaria</SelectItem>
                <SelectItem value="Transporte">Transporte</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ciudades</SelectItem>
                <SelectItem value="La Paz">La Paz</SelectItem>
                <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                <SelectItem value="Cochabamba">Cochabamba</SelectItem>
                <SelectItem value="Tarija">Tarija</SelectItem>
                <SelectItem value="Oruro">Oruro</SelectItem>
                <SelectItem value="Potosí">Potosí</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="outline" className="whitespace-nowrap">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
          <div className="text-muted-foreground">
            Mostrando {filteredMembers.length} de {members.length} miembros
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.registration}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.specialty}</Badge>
                    </TableCell>
                    <TableCell>{member.city}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>
                      <Badge className="bg-secondary text-secondary-foreground">
                        {member.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron miembros que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
