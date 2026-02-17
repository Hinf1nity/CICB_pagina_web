import { useState } from 'react';
import { CalculatorForm, type FormData } from './calculator-form';
import { ResultsDisplay, type CalculationResult } from './results-display';
import { calculateFees } from './calculator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Calculator } from 'lucide-react';

export function CalculatorPage() {
    const [results, setResults] = useState<CalculationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: FormData) => {
        setIsLoading(true);

        // Simular una llamada al backend
        await new Promise(resolve => setTimeout(resolve, 800));

        const calculatedResults = calculateFees(data); //Aca poner la logica de calculo real
        setResults(calculatedResults);
        setIsLoading(false);
    };

    const handleReset = () => {
        setResults(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            {/* Header */}
            <header className="bg-primary text-white shadow-lg">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-3">
                        <Calculator className="w-8 h-8" />
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold">
                                Colegio de Ingenieros Civiles de Bolivia
                            </h1>
                            <p className="text-sm text-primary-foreground/80 mt-1">
                                Calculadora de Aranceles Profesionales
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulario */}
                    <div>
                        <Card className="shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                                <CardTitle className="text-primary">Datos del Ingeniero</CardTitle>
                                <CardDescription>
                                    Complete el formulario con la información requerida para calcular el arancel correspondiente.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <CalculatorForm onSubmit={handleSubmit} isLoading={isLoading} />

                                {results && (
                                    <button
                                        onClick={handleReset}
                                        className="mt-4 text-sm text-primary hover:text-secondary underline"
                                    >
                                        Realizar nuevo cálculo
                                    </button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Información adicional */}
                        <Card className="mt-6 bg-secondary/5 border-secondary/20">
                            <CardContent className="pt-6">
                                <div className="space-y-3 text-sm">
                                    <h3 className="font-semibold text-primary">Notas importantes:</h3>
                                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                        <li>Los aranceles son calculados según reglamentación vigente del Colegio de Ingenieros Civiles de Bolivia.</li>
                                        <li>Los valores mostrados son referenciales y pueden variar según complejidad del proyecto.</li>
                                        <li>Para trabajos en el campo se aplica un incremento del 30%.</li>
                                        <li>La antigüedad profesional incrementa el arancel en un 2% anual (máximo 60%).</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Resultados */}
                    <div>
                        {isLoading ? (
                            <Card className="shadow-xl">
                                <CardContent className="pt-20 pb-20">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-muted-foreground">Calculando aranceles...</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : results ? (
                            <ResultsDisplay results={results} />
                        ) : (
                            <Card className="shadow-xl border-2 border-dashed border-primary/30">
                                <CardContent className="pt-20 pb-20">
                                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Calculator className="w-8 h-8 text-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-primary">Sin resultados aún</h3>
                                            <p className="text-sm text-muted-foreground max-w-md">
                                                Complete el formulario de la izquierda y haga clic en "Calcular Arancel" para ver los resultados.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-primary/5 mt-12 py-6 border-t border-primary/10">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>&copy; 2026 Colegio de Ingenieros Civiles de Bolivia. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
