import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { Users, Briefcase, TrendingUp, MapPin } from 'lucide-react';

export function StatsPage() {
  const [selectedYear, setSelectedYear] = useState('2025');

  // Datos de especialidades
  const specialtyData = [
    { specialty: 'Estructural', count: 245, percentage: 28 },
    { specialty: 'Vial', count: 198, percentage: 23 },
    { specialty: 'Hidráulica', count: 152, percentage: 17 },
    { specialty: 'Geotecnia', count: 134, percentage: 15 },
    { specialty: 'Construcción', count: 89, percentage: 10 },
    { specialty: 'Ambiental', count: 45, percentage: 5 },
    { specialty: 'Sanitaria', count: 12, percentage: 1 },
    { specialty: 'Transporte', count: 8, percentage: 1 },
  ];

  // Datos de ingenieros por departamento
  const departmentData = [
    { department: 'La Paz', engineers: 312, active: 289, inactive: 23 },
    { department: 'Santa Cruz', engineers: 278, active: 256, inactive: 22 },
    { department: 'Cochabamba', engineers: 198, active: 182, inactive: 16 },
    { department: 'Tarija', engineers: 67, active: 61, inactive: 6 },
    { department: 'Oruro', engineers: 45, active: 41, inactive: 4 },
    { department: 'Potosí', engineers: 34, active: 30, inactive: 4 },
    { department: 'Chuquisaca', engineers: 28, active: 25, inactive: 3 },
    { department: 'Beni', engineers: 18, active: 16, inactive: 2 },
    { department: 'Pando', engineers: 3, active: 3, inactive: 0 },
  ];

  // Datos de empleo
  const employmentData = [
    { name: 'Con Trabajo', value: 756, percentage: 86.4 },
    { name: 'Sin Trabajo', value: 119, percentage: 13.6 },
  ];

  // Datos de evolución anual
  const evolutionData = [
    { year: '2020', total: 745, employed: 621, unemployed: 124 },
    { year: '2021', total: 789, employed: 668, unemployed: 121 },
    { year: '2022', total: 823, employed: 701, unemployed: 122 },
    { year: '2023', total: 854, employed: 728, unemployed: 126 },
    { year: '2024', total: 875, employed: 756, unemployed: 119 },
  ];

  // Colores institucionales del CICB
  const COLORS = {
    primary: '#0B3D2E',
    secondary: '#1B5E3A',
    tertiary: '#3C8D50',
    accent: '#3A5A78',
    light: '#F2F2F2',
    gray: '#B0B0B0',
  };

  const CHART_COLORS = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.tertiary,
    COLORS.accent,
    '#2C7A4E',
    '#4A6B82',
    '#5A8D65',
    '#6B7C8E',
  ];

  const totalEngineers = departmentData.reduce((sum, d) => sum + d.engineers, 0);
  const totalEmployed = employmentData.find(d => d.name === 'Con Trabajo')?.value || 0;
  const totalUnemployed = employmentData.find(d => d.name === 'Sin Trabajo')?.value || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="mb-3">Estadísticas</h1>
          <p>Análisis y métricas del Colegio de Ingenieros Civiles de Bolivia</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="bg-muted py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Total Ingenieros</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="mb-1">{totalEngineers.toLocaleString()}</div>
                <p className="text-muted-foreground">Colegiados activos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Con Trabajo</CardTitle>
                <Briefcase className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="mb-1">{totalEmployed.toLocaleString()}</div>
                <p className="text-muted-foreground">
                  {((totalEmployed / totalEngineers) * 100).toFixed(1)}% del total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Buscando Empleo</CardTitle>
                <TrendingUp className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="mb-1">{totalUnemployed.toLocaleString()}</div>
                <p className="text-muted-foreground">
                  {((totalUnemployed / totalEngineers) * 100).toFixed(1)}% del total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Departamentos</CardTitle>
                <MapPin className="h-5 w-5 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="mb-1">{departmentData.length}</div>
                <p className="text-muted-foreground">Presencia nacional</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Especialidades - Gráfico de Barras */}
          <Card>
            <CardHeader>
              <CardTitle>Ingenieros por Especialidad</CardTitle>
              <CardDescription>Distribución de colegiados según área de especialización</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={specialtyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="specialty" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #ccc',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" name="Cantidad" fill={COLORS.primary} radius={[8, 8, 0, 0]}>
                    {specialtyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {specialtyData.slice(0, 4).map((item, index) => (
                  <div key={item.specialty} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: CHART_COLORS[index] }}
                    />
                    <span className="text-muted-foreground">{item.specialty}: {item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estado de Empleo - Gráfico de Pie */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de Empleo</CardTitle>
              <CardDescription>Distribución de ingenieros con y sin trabajo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={employmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {employmentData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? COLORS.secondary : COLORS.accent} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #ccc',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex flex-col gap-3">
                {employmentData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: index === 0 ? COLORS.secondary : COLORS.accent }}
                      />
                      <span className="text-foreground">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-foreground">{item.value}</span>
                      <Badge variant="outline">{item.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ingenieros por Departamento - Gráfico Horizontal */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Distribución Geográfica</CardTitle>
            <CardDescription>Ingenieros colegiados por departamento</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={departmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" style={{ fontSize: '12px' }} />
                <YAxis dataKey="department" type="category" width={100} style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="active" name="Activos" fill={COLORS.primary} stackId="a" radius={[0, 4, 4, 0]} />
                <Bar dataKey="inactive" name="Inactivos" fill={COLORS.gray} stackId="a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {departmentData.slice(0, 6).map((dept) => (
                <div key={dept.department} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-muted-foreground">{dept.department}</span>
                  <Badge variant="outline">{dept.engineers}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Evolución Histórica */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Evolución Histórica</CardTitle>
                <CardDescription>Tendencia de colegiados y situación laboral (2020-2024)</CardDescription>
              </div>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleccionar año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">Todos los años</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" style={{ fontSize: '12px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  name="Total Colegiados"
                  stroke={COLORS.primary} 
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary, r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="employed" 
                  name="Con Trabajo"
                  stroke={COLORS.secondary} 
                  strokeWidth={3}
                  dot={{ fill: COLORS.secondary, r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="unemployed" 
                  name="Sin Trabajo"
                  stroke={COLORS.accent} 
                  strokeWidth={3}
                  dot={{ fill: COLORS.accent, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Crecimiento Anual</span>
                </div>
                <div className="text-foreground">+3.2%</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="text-muted-foreground">Tasa de Empleo</span>
                </div>
                <div className="text-foreground">86.4%</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-muted-foreground">Tendencia</span>
                </div>
                <div className="text-foreground">Positiva ↑</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
