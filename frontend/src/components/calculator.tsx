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
            items: [
                { name: "Estudio de Prefactibilidad", cost: 15000 * baseFactor },
                { name: "Proyecto Arquitectónico Básico", cost: 25000 * baseFactor },
                { name: "Proyecto Arquitectónico Ejecutivo", cost: 35000 * baseFactor },
                { name: "Diseño de Instalaciones Eléctricas", cost: 18000 * baseFactor },
                { name: "Diseño de Instalaciones Sanitarias", cost: 16000 * baseFactor },
                { name: "Estudio de Impacto Ambiental", cost: 28000 * baseFactor },
            ]
        },
        {
            category: "MENSURAS",
            items: [
                { name: "Levantamiento Topográfico", cost: 8000 * baseFactor },
                { name: "Replanteo de Obra", cost: 6000 * baseFactor },
                { name: "Amojonamiento", cost: 5000 * baseFactor },
                { name: "Certificado de Límites", cost: 4000 * baseFactor },
            ]
        },
        {
            category: "ESTRUCTURAS",
            items: [
                { name: "Análisis Estructural Edificio", cost: 22000 * baseFactor },
                { name: "Diseño Estructural Hormigón Armado", cost: 30000 * baseFactor },
                { name: "Diseño Estructural Metálico", cost: 28000 * baseFactor },
                { name: "Revisión y Aprobación de Cálculo", cost: 15000 * baseFactor },
                { name: "Reforzamiento Estructural", cost: 25000 * baseFactor },
            ]
        },
        {
            category: "GEOTECNIA",
            items: [
                { name: "Estudio de Suelos", cost: 12000 * baseFactor },
                { name: "Estudio de Mecánica de Rocas", cost: 18000 * baseFactor },
                { name: "Diseño de Cimentaciones", cost: 16000 * baseFactor },
                { name: "Estudio de Estabilidad de Taludes", cost: 20000 * baseFactor },
            ]
        },
        {
            category: "HIDRÁULICA",
            items: [
                { name: "Diseño Sistema Agua Potable", cost: 24000 * baseFactor },
                { name: "Diseño Sistema de Riego", cost: 28000 * baseFactor },
                { name: "Estudio Hidrológico", cost: 22000 * baseFactor },
                { name: "Diseño de Obras Hidráulicas", cost: 32000 * baseFactor },
            ]
        },
        {
            category: "SANITARIA Y PLUVIAL",
            items: [
                { name: "Diseño Sistema Alcantarillado Sanitario", cost: 26000 * baseFactor },
                { name: "Diseño Sistema Alcantarillado Pluvial", cost: 24000 * baseFactor },
                { name: "Planta de Tratamiento Aguas Residuales", cost: 35000 * baseFactor },
                { name: "Sistema de Drenaje", cost: 18000 * baseFactor },
            ]
        },
        {
            category: "VÍAS Y CAMINOS",
            items: [
                { name: "Diseño Geométrico Carretera", cost: 30000 * baseFactor },
                { name: "Diseño de Pavimentos", cost: 25000 * baseFactor },
                { name: "Estudio de Tráfico", cost: 15000 * baseFactor },
                { name: "Señalización Vial", cost: 12000 * baseFactor },
                { name: "Obras de Arte (Puentes menores)", cost: 28000 * baseFactor },
            ]
        },
        {
            category: "LABORATORIOS",
            items: [
                { name: "Ensayo de Compresión Hormigón", cost: 800 * baseFactor },
                { name: "Ensayo de Suelos (Completo)", cost: 2500 * baseFactor },
                { name: "Ensayo Granulométrico", cost: 600 * baseFactor },
                { name: "Ensayo de Límites Atterberg", cost: 700 * baseFactor },
                { name: "Ensayo Proctor", cost: 900 * baseFactor },
            ]
        },
        {
            category: "DOCENCIA",
            items: [
                { name: "Hora Académica Pregrado", cost: 150 * baseFactor },
                { name: "Hora Académica Posgrado", cost: 250 * baseFactor },
                { name: "Tutoría de Tesis", cost: 5000 * baseFactor },
                { name: "Curso de Capacitación (por hora)", cost: 200 * baseFactor },
            ]
        }
    ];
}
