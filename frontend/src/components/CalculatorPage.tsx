import { useState } from "react";
import { toast } from "sonner";
import { type FormData } from "../validations/CalculatorSchema";
import { CalculatorForm } from "./calculator-form";
import { ResultsDisplay, type CalculationResult } from "./results-display";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Calculator } from "lucide-react";
import { useCalculatorData } from "../hooks/useCalculatorData";

export function CalculatorPage() {
  const [results, setResults] = useState<CalculationResult | null>(null);
  const { calculateMutation } = useCalculatorData();

  const handleCalculate = (data: FormData) => {
    calculateMutation.mutate(data, {
      onSuccess: (res) => {
        setResults(res);
        toast.success("Cálculo realizado con éxito");
      },
      onError: () => {
        setResults(null);
        toast.error("Error al conectar con el servidor");
      },
    });
  };

  const handleReset = () => {
    setResults(null);
    calculateMutation.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Calculator className="w-8 h-8" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold uppercase">
                Colegio de Ingenieros Civiles de Bolivia
              </h1>
              <p className="text-sm text-primary-foreground/80 mt-1">
                Calculadora de Aranceles Profesionales (Validada)
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="shadow-xl">
              {/* Aquí está el "recuadro verdecito" con degradado */}
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardTitle className="text-primary">
                  Datos del Ingeniero
                </CardTitle>
                <CardDescription>
                  Complete el formulario para calcular el arancel.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <CalculatorForm
                  onSubmit={handleCalculate}
                  isLoading={calculateMutation.isPending}
                />
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
          </div>

          <div>
            {calculateMutation.isPending ? (
              <Card className="shadow-xl">
                <CardContent className="pt-20 pb-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-muted-foreground">
                    Calculando aranceles...
                  </p>
                </CardContent>
              </Card>
            ) : results ? (
              <ResultsDisplay results={results} />
            ) : (
              <Card className="shadow-xl border-2 border-dashed border-primary/30 h-full flex items-center justify-center">
                <CardContent className="pt-20 pb-20 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calculator className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">
                      Sin resultados aún
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Complete el formulario y haga clic en "Calcular Arancel".
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
