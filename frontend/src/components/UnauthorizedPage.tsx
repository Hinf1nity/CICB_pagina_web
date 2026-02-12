import { ShieldX, Lock, ArrowLeft, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useNavigate } from 'react-router-dom';

export function UnauthorizedPage() {
    const navigate = useNavigate();
    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">
                <Card className="border-2 shadow-lg">
                    <CardContent className="pt-12 pb-8">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
                                <ShieldX className="w-12 h-12 text-red-500" />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center mb-6">
                            <h1 className="text-foreground mb-3">Acceso No Autorizado</h1>
                            <p className="text-lg text-muted-foreground mb-2">
                                No tienes permisos para acceder a esta página
                            </p>
                        </div>

                        {/* Message */}
                        <Card className="bg-muted/50 border-border mb-8">
                            <CardContent className="pt-6">
                                <div className="flex gap-4">
                                    <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                    <div className="space-y-2">
                                        <p className="text-foreground">
                                            Esta sección está restringida y requiere permisos especiales de acceso.
                                        </p>
                                        <p className="text-muted-foreground">
                                            Si crees que deberías tener acceso a esta área, por favor contacta al administrador del sistema del Colegio de Ingenieros Civiles de Bolivia.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Error Code */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                                <span className="text-red-600 font-mono">Error 403</span>
                                <span className="text-red-400">|</span>
                                <span className="text-red-600">Forbidden</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                onClick={handleGoBack}
                                variant="outline"
                                className="gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Volver Atrás
                            </Button>
                            <Button
                                onClick={handleGoHome}
                                className="bg-primary text-primary-foreground gap-2"
                            >
                                <Home className="w-4 h-4" />
                                Ir al Inicio
                            </Button>
                        </div>

                        {/* Contact Info */}
                        <div className="mt-8 pt-8 border-t border-border text-center">
                            <p className="text-muted-foreground mb-2">
                                ¿Necesitas ayuda?
                            </p>
                            <p className="text-foreground">
                                Contacta al administrador:{' '}
                                <a
                                    href="mailto:colegiocivbolivia@gmail.com"
                                    className="text-primary hover:underline"
                                >
                                    colegiocivbolivia@gmail.com
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Info */}
                <div className="mt-6 text-center text-muted-foreground">
                    <p>
                        Colegio de Ingenieros Civiles de Bolivia
                    </p>
                </div>
            </div>
        </div>
    );
}
