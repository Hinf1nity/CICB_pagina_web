import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Separator } from "./ui/separator";

export interface WorkItem {
    name: string;
    cost: number;
}

export interface WorkCategory {
    category: string;
    items: WorkItem[];
}

export interface CalculationResult {
    monthlyFee: number;
    dailyFee: number;
    hourlyFee: number;
    workCategories: WorkCategory[];
}

interface ResultsDisplayProps {
    results: CalculationResult;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Aranceles principales */}
            <Card className="border-2 border-primary/20">
                <CardHeader className="bg-primary/5">
                    <CardTitle className="text-primary">Aranceles Profesionales</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-secondary/10 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-2">Arancel Mensual</p>
                            <p className="text-2xl font-semibold text-secondary">{formatCurrency(results.monthlyFee)}</p>
                        </div>
                        <div className="text-center p-4 bg-secondary/10 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-2">Arancel Diario</p>
                            <p className="text-2xl font-semibold text-secondary">{formatCurrency(results.dailyFee)}</p>
                        </div>
                        <div className="text-center p-4 bg-secondary/10 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-2">Arancel por Hora</p>
                            <p className="text-2xl font-semibold text-secondary">{formatCurrency(results.hourlyFee)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Costos por trabajo desarrollado */}
            <Card>
                <CardHeader className="bg-primary/5">
                    <CardTitle className="text-primary">Costos por Trabajo Desarrollado</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <Accordion type="single" collapsible className="w-full">
                        {results.workCategories.map((category, idx) => (
                            <AccordionItem key={idx} value={`item-${idx}`}>
                                <AccordionTrigger className="text-left hover:text-primary">
                                    <span className="font-semibold">{category.category}</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-2 pt-2">
                                        {category.items.map((item, itemIdx) => (
                                            <div key={itemIdx}>
                                                <div className="flex justify-between items-center py-2 px-4 hover:bg-accent rounded-md">
                                                    <span className="text-sm">{item.name}</span>
                                                    <span className="font-semibold text-secondary">{formatCurrency(item.cost)}</span>
                                                </div>
                                                {itemIdx < category.items.length - 1 && <Separator />}
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
