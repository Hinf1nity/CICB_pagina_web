import { useStatsData } from "../hooks/useStatsData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Users, Briefcase, TrendingUp, MapPin } from 'lucide-react';

interface Specialty {
  specialty: string;
  count: number;
  percentage?: number;
}

interface Department {
  department: string;
  engineers: number;
  active: number;
  inactive: number;
}

interface Employment {
  name: string;
  value: number;
  percentage?: number;
}

export function StatsPage() {
  // const [selectedYear, setSelectedYear] = useState('2025');

  const {
    data,
    isLoading: loading,
    error
  } = useStatsData();
  const { specialties = [], departments = [], employment = [], evolution = [] } = data || {};

  const COLORS = {
    primary: '#0B3D2E',
    secondary: '#1B5E3A',
    tertiary: '#3C8D50',
    accent: '#3A5A78',
    light: '#F2F2F2',
    gray: '#B0B0B0',
  };

  const CHART_COLORS = [
    COLORS.primary, COLORS.secondary, COLORS.tertiary,
    COLORS.accent, '#2C7A4E', '#4A6B82', '#5A8D65', '#6B7C8E',
  ];

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Cargando las estadísticas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Error al cargar las estadísticas.
      </div>
    );
  }

  const totalEngineers = (departments || []).reduce((sum: number, d: Department) => sum + d.engineers, 0);
  const totalEmployed = (employment || []).find((d: Employment) => d.name === 'Con Trabajo')?.value || 0;
  const totalUnemployed = (employment || []).find((d: Employment) => d.name === 'Sin Trabajo')?.value || 0;

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

            {/* Total Ingenieros */}
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

            {/* Con Trabajo */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Con Trabajo</CardTitle>
                <Briefcase className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="mb-1">{totalEmployed.toLocaleString()}</div>
                <p className="text-muted-foreground">
                  {totalEngineers > 0 ? ((totalEmployed / totalEngineers) * 100).toFixed(1) : '0.0'}% del total
                </p>
              </CardContent>
            </Card>

            {/* Sin Trabajo */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Buscando Empleo</CardTitle>
                <TrendingUp className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="mb-1">{totalUnemployed.toLocaleString()}</div>
                <p className="text-muted-foreground">
                  {totalEngineers > 0 ? ((totalUnemployed / totalEngineers) * 100).toFixed(1) : '0.0'}% del total
                </p>
              </CardContent>
            </Card>

            {/* Departamentos */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Departamentos</CardTitle>
                <MapPin className="h-5 w-5 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="mb-1">{departments.length}</div>
                <p className="text-muted-foreground">Presencia nacional</p>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Especialidades */}
          <Card>
            <CardHeader>
              <CardTitle>Ingenieros por Especialidad</CardTitle>
              <CardDescription>Distribución de colegiados según área de especialización</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={specialties}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="specialty" angle={-45} textAnchor="end" height={100} style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Cantidad" fill={COLORS.primary} radius={[8, 8, 0, 0]}>
                    {(specialties || []).map((_: Specialty, index: number) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {(specialties || []).slice(0, 4).map((item: Specialty, index: number) => (
                  <div key={item.specialty} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[index] }} />
                    <span className="text-muted-foreground">{item.specialty}: {item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Empleo */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de Empleo</CardTitle>
              <CardDescription>Distribución de ingenieros con y sin trabajo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={(employment || []).map((e: Employment) => ({ name: e.name, value: e.value }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name}: ${(Number(percent) * 100).toFixed(0)}%`}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {(employment || []).map((_, index: number) => (
                      <Cell
                        key={index}
                        fill={index === 0 ? COLORS.secondary : COLORS.accent}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 flex flex-col gap-3">
                {(employment || []).map((item: Employment, index: number) => (
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
                      <Badge variant="outline">{item.percentage ?? Math.round((item.value / Math.max(totalEngineers, 1)) * 100)}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Departamentos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Distribución Geográfica</CardTitle>
            <CardDescription>Ingenieros colegiados por departamento</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={departments} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" />
                <YAxis dataKey="department" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="active" name="Activos" fill={COLORS.primary} stackId="a" radius={[0, 4, 4, 0]} />
                <Bar dataKey="inactive" name="Inactivos" fill={COLORS.gray} stackId="a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {(departments || []).slice(0, 6).map((dept: Department) => (
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
                <CardDescription>Tendencia de colegiados y situación laboral ({new Date().getFullYear() - 4}-{new Date().getFullYear()})</CardDescription>
              </div>

              {/* <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleccionar año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">Todos los años</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={evolution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line type="monotone" dataKey="total" name="Total Colegiados"
                  stroke={COLORS.primary} strokeWidth={3}
                  dot={{ fill: COLORS.primary, r: 5 }} />

                <Line type="monotone" dataKey="new" name="Colegiados Nuevos"
                  stroke={COLORS.secondary} strokeWidth={3}
                  dot={{ fill: COLORS.secondary, r: 5 }} />

                {/* <Line type="monotone" dataKey="unemployed" name="Sin Trabajo"
                  stroke={COLORS.accent} strokeWidth={3}
                  dot={{ fill: COLORS.accent, r: 5 }} /> */}
              </LineChart>
            </ResponsiveContainer>

            {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div> */}

          </CardContent>
        </Card>

      </div>

    </div>
  );
}