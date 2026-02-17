import { type FormData } from "./calculator-form";
import { type CalculationResult } from "./results-display";

// Función simulada que calcula los aranceles basados en los datos del formulario
export function calculateFees(formData: FormData): CalculationResult {
    // Base mensual según grado de formación
    const educationMultiplier: Record<string, number> = {
        'tecnico': 1.0,
        'licenciatura': 1.2,
        'diplomado': 1.4,
        'especialidad': 1.6,
        'maestria': 1.8,
        'doctorado': 2.2,
    };

    // Multiplicador por departamento (costo de vida)
    const departmentMultiplier: Record<string, number> = {
        'la-paz': 1.1,
        'cochabamba': 1.0,
        'santa-cruz': 1.15,
        'oruro': 0.9,
        'potosi': 0.85,
        'chuquisaca': 0.9,
        'tarija': 0.95,
        'beni': 0.95,
        'pando': 0.9,
    };

    // Multiplicador por locación
    const locationMultiplier = formData.location === 'campo' ? 1.3 : 1.0;

    // Multiplicador por tipo de actividad
    const activityMultiplier: Record<string, number> = {
        'diseno': 1.2,
        'supervision': 1.0,
        'avaluo': 1.1,
    };

    // Base salarial de referencia (en BOB - Bolivianos)
    const baseSalary = 8000;

    // Incremento por años de experiencia (2% por año, máximo 60%)
    const experienceBonus = Math.min(formData.yearsOfExperience * 0.02, 0.6);

    // Cálculo del arancel mensual
    const monthlyFee =
        baseSalary *
        (educationMultiplier[formData.educationLevel] || 1.0) *
        (departmentMultiplier[formData.department] || 1.0) *
        locationMultiplier *
        (activityMultiplier[formData.activityType] || 1.0) *
        (1 + experienceBonus);

    const dailyFee = monthlyFee / 22; // 22 días laborables promedio
    const hourlyFee = dailyFee / 8; // 8 horas por día

    // Generar costos por trabajo desarrollado
    const workCategories = generateWorkCategories(monthlyFee, formData);

    return {
        monthlyFee,
        dailyFee,
        hourlyFee,
        workCategories,
    };
}

function generateWorkCategories(monthlyFee: number, formData: FormData) {
    // Factor base para cálculos de trabajos específicos
    const baseFactor = monthlyFee / 10000;

    return [
        {
            category: "ESTUDIOS Y PROYECTOS",
            complexityLevels: [
                {
                    level: "Básica",
                    items: [
                        { name: "Anteproyecto arquitectónico vivienda unifamiliar", cost: 8000 * baseFactor },
                        { name: "Proyecto básico instalaciones domiciliarias", cost: 6000 * baseFactor },
                    ]
                },
                {
                    level: "Simples",
                    items: [
                        { name: "Proyecto arquitectónico vivienda unifamiliar", cost: 12000 * baseFactor },
                        { name: "Estudio de Prefactibilidad", cost: 15000 * baseFactor },
                        { name: "Proyecto de instalaciones eléctricas básicas", cost: 10000 * baseFactor },
                    ]
                },
                {
                    level: "Medianas",
                    items: [
                        { name: "Proyecto Arquitectónico Edificio Multifamiliar", cost: 25000 * baseFactor },
                        { name: "Diseño de Instalaciones Eléctricas", cost: 18000 * baseFactor },
                        { name: "Diseño de Instalaciones Sanitarias", cost: 16000 * baseFactor },
                    ]
                },
                {
                    level: "Medianamente Complejas",
                    items: [
                        { name: "Proyecto Arquitectónico Ejecutivo", cost: 35000 * baseFactor },
                        { name: "Estudio de Impacto Ambiental", cost: 28000 * baseFactor },
                        { name: "Proyecto integral de edificación", cost: 32000 * baseFactor },
                    ]
                },
                {
                    level: "Complejas",
                    items: [
                        { name: "Proyecto arquitectónico edificio alto", cost: 45000 * baseFactor },
                        { name: "Master Plan desarrollo urbano", cost: 55000 * baseFactor },
                        { name: "Centro comercial o industrial", cost: 50000 * baseFactor },
                    ]
                },
                {
                    level: "Especiales",
                    items: [
                        { name: "Proyectos de gran envergadura", cost: 75000 * baseFactor },
                        { name: "Infraestructura crítica especializada", cost: 85000 * baseFactor },
                    ]
                }
            ]
        },
        {
            category: "MENSURAS",
            complexityLevels: [
                {
                    level: "Básica",
                    items: [
                        { name: "Levantamiento topográfico lote pequeño", cost: 3000 * baseFactor },
                        { name: "Certificado de Límites", cost: 4000 * baseFactor },
                    ]
                },
                {
                    level: "Simples",
                    items: [
                        { name: "Levantamiento Topográfico terreno urbano", cost: 8000 * baseFactor },
                        { name: "Replanteo de Obra", cost: 6000 * baseFactor },
                        { name: "Amojonamiento", cost: 5000 * baseFactor },
                    ]
                },
                {
                    level: "Medianas",
                    items: [
                        { name: "Levantamiento topográfico predios rurales", cost: 12000 * baseFactor },
                        { name: "Replanteo urbano complejo", cost: 10000 * baseFactor },
                    ]
                },
                {
                    level: "Complejas",
                    items: [
                        { name: "Levantamiento topográfico extenso", cost: 20000 * baseFactor },
                        { name: "Cartografía digital georreferenciada", cost: 18000 * baseFactor },
                    ]
                },
                {
                    level: "Sin Nivel",
                    items: [
                        { name: "Servicios topográficos especializados", cost: 15000 * baseFactor },
                    ]
                }
            ]
        },
        {
            category: "ESTRUCTURAS",
            complexityLevels: [
                {
                    level: "Básica",
                    items: [
                        { name: "Diseño estructural vivienda una planta", cost: 8000 * baseFactor },
                        { name: "Cálculo losa simple", cost: 5000 * baseFactor },
                    ]
                },
                {
                    level: "Simples",
                    items: [
                        { name: "Diseño estructural vivienda dos plantas", cost: 15000 * baseFactor },
                        { name: "Revisión y Aprobación de Cálculo básico", cost: 10000 * baseFactor },
                    ]
                },
                {
                    level: "Medianas",
                    items: [
                        { name: "Análisis Estructural Edificio", cost: 22000 * baseFactor },
                        { name: "Diseño Estructural Hormigón Armado", cost: 30000 * baseFactor },
                        { name: "Revisión y Aprobación de Cálculo", cost: 15000 * baseFactor },
                    ]
                },
                {
                    level: "Medianamente Complejas",
                    items: [
                        { name: "Diseño Estructural Metálico", cost: 28000 * baseFactor },
                        { name: "Reforzamiento Estructural", cost: 25000 * baseFactor },
                        { name: "Estructuras con sistemas especiales", cost: 35000 * baseFactor },
                    ]
                },
                {
                    level: "Complejas",
                    items: [
                        { name: "Dise��o estructural edificio alto", cost: 50000 * baseFactor },
                        { name: "Análisis sísmico avanzado", cost: 45000 * baseFactor },
                        { name: "Estructuras de grandes luces", cost: 55000 * baseFactor },
                    ]
                },
                {
                    level: "Especiales",
                    items: [
                        { name: "Estructuras singulares o monumentales", cost: 75000 * baseFactor },
                        { name: "Puentes y obras de arte mayores", cost: 85000 * baseFactor },
                    ]
                }
            ]
        },
        {
            category: "GEOTECNIA",
            complexityLevels: [
                {
                    level: "Básica",
                    items: [
                        { name: "Estudio de Suelos básico (2-3 perforaciones)", cost: 6000 * baseFactor },
                        { name: "Informe geotécnico simple", cost: 5000 * baseFactor },
                    ]
                },
                {
                    level: "Simples",
                    items: [
                        { name: "Estudio de Suelos", cost: 12000 * baseFactor },
                        { name: "Diseño de Cimentaciones superficiales", cost: 10000 * baseFactor },
                    ]
                },
                {
                    level: "Medianas",
                    items: [
                        { name: "Diseño de Cimentaciones", cost: 16000 * baseFactor },
                        { name: "Estudio de Mecánica de Rocas", cost: 18000 * baseFactor },
                    ]
                },
                {
                    level: "Complejas",
                    items: [
                        { name: "Estudio de Estabilidad de Taludes", cost: 20000 * baseFactor },
                        { name: "Diseño de cimentaciones profundas", cost: 25000 * baseFactor },
                        { name: "Estudio geotécnico complejo", cost: 28000 * baseFactor },
                    ]
                },
                {
                    level: "Especiales",
                    items: [
                        { name: "Estudios geotécnicos de alta complejidad", cost: 40000 * baseFactor },
                        { name: "Instrumentación y monitoreo geotécnico", cost: 35000 * baseFactor },
                    ]
                }
            ]
        },
        {
            category: "HIDRÁULICA",
            complexityLevels: [
                {
                    level: "Simples",
                    items: [
                        { name: "Diseño sistema agua potable domiciliario", cost: 12000 * baseFactor },
                        { name: "Estudio Hidrológico básico", cost: 15000 * baseFactor },
                    ]
                },
                {
                    level: "Medianas",
                    items: [
                        { name: "Diseño Sistema Agua Potable", cost: 24000 * baseFactor },
                        { name: "Estudio Hidrológico", cost: 22000 * baseFactor },
                    ]
                },
                {
                    level: "Complejas",
                    items: [
                        { name: "Diseño Sistema de Riego", cost: 28000 * baseFactor },
                        { name: "Diseño de Obras Hidráulicas", cost: 32000 * baseFactor },
                    ]
                },
                {
                    level: "Especiales",
                    items: [
                        { name: "Obras hidráulicas mayores", cost: 50000 * baseFactor },
                        { name: "Sistemas de aprovechamiento hídrico complejos", cost: 45000 * baseFactor },
                    ]
                }
            ]
        },
        {
            category: "SANITARIA Y PLUVIAL",
            complexityLevels: [
                {
                    level: "Básica",
                    items: [
                        { name: "Diseño sanitario domiciliario", cost: 8000 * baseFactor },
                        { name: "Sistema de drenaje simple", cost: 10000 * baseFactor },
                    ]
                },
                {
                    level: "Simples",
                    items: [
                        { name: "Sistema de Drenaje", cost: 18000 * baseFactor },
                        { name: "Diseño alcantarillado edificio", cost: 15000 * baseFactor },
                    ]
                },
                {
                    level: "Medianas",
                    items: [
                        { name: "Diseño Sistema Alcantarillado Pluvial", cost: 24000 * baseFactor },
                        { name: "Diseño Sistema Alcantarillado Sanitario", cost: 26000 * baseFactor },
                    ]
                },
                {
                    level: "Complejas",
                    items: [
                        { name: "Planta de Tratamiento Aguas Residuales", cost: 35000 * baseFactor },
                        { name: "Sistema integral sanitario urbano", cost: 40000 * baseFactor },
                    ]
                },
                {
                    level: "Especiales",
                    items: [
                        { name: "Plantas de tratamiento de gran capacidad", cost: 60000 * baseFactor },
                        { name: "Sistemas sanitarios complejos", cost: 55000 * baseFactor },
                    ]
                }
            ]
        },
        {
            category: "VÍAS Y CAMINOS",
            complexityLevels: [
                {
                    level: "Básica",
                    items: [
                        { name: "Diseño vías locales", cost: 12000 * baseFactor },
                        { name: "Señalización Vial básica", cost: 8000 * baseFactor },
                    ]
                },
                {
                    level: "Simples",
                    items: [
                        { name: "Estudio de Tráfico", cost: 15000 * baseFactor },
                        { name: "Señalización Vial", cost: 12000 * baseFactor },
                        { name: "Diseño de pavimento urbano", cost: 18000 * baseFactor },
                    ]
                },
                {
                    level: "Medianas",
                    items: [
                        { name: "Diseño de Pavimentos", cost: 25000 * baseFactor },
                        { name: "Obras de Arte (Puentes menores)", cost: 28000 * baseFactor },
                    ]
                },
                {
                    level: "Complejas",
                    items: [
                        { name: "Diseño Geométrico Carretera", cost: 30000 * baseFactor },
                        { name: "Estudios viales integrales", cost: 35000 * baseFactor },
                    ]
                },
                {
                    level: "Especiales",
                    items: [
                        { name: "Autopistas y vías expresas", cost: 65000 * baseFactor },
                        { name: "Intercambiadores viales", cost: 55000 * baseFactor },
                    ]
                }
            ]
        },
        {
            category: "LABORATORIOS",
            complexityLevels: [
                {
                    level: "Básica",
                    items: [
                        { name: "Ensayo de Compresión Hormigón (unidad)", cost: 800 * baseFactor },
                        { name: "Ensayo Granulométrico", cost: 600 * baseFactor },
                    ]
                },
                {
                    level: "Simples",
                    items: [
                        { name: "Ensayo de Límites Atterberg", cost: 700 * baseFactor },
                        { name: "Ensayo Proctor", cost: 900 * baseFactor },
                        { name: "Ensayo CBR", cost: 1200 * baseFactor },
                    ]
                },
                {
                    level: "Medianas",
                    items: [
                        { name: "Ensayo de Suelos (Completo)", cost: 2500 * baseFactor },
                        { name: "Ensayo triaxial", cost: 3000 * baseFactor },
                    ]
                },
                {
                    level: "Complejas",
                    items: [
                        { name: "Estudios de laboratorio integrales", cost: 5000 * baseFactor },
                        { name: "Ensayos especiales de materiales", cost: 4500 * baseFactor },
                    ]
                },
                {
                    level: "Sin Nivel",
                    items: [
                        { name: "Servicios de laboratorio personalizados", cost: 3500 * baseFactor },
                    ]
                }
            ]
        },
        {
            category: "DOCENCIA",
            complexityLevels: [
                {
                    level: "Sin Nivel",
                    items: [
                        { name: "Consultoría académica", cost: 6000 * baseFactor },
                        { name: "Consultoría académica", cost: 6000 * baseFactor },
                        { name: "Consultoría académica", cost: 6000 * baseFactor },
                        { name: "Consultoría académica", cost: 6000 * baseFactor },
                        { name: "Consultoría académica", cost: 6000 * baseFactor },
                    ]
                }
            ]
        }
    ];
}