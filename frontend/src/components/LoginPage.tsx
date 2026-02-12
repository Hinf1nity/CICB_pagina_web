import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Lock, Mail, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from "react-hook-form";
import { type LoginData } from '../validations/loginSchema';
import { useAuth } from '../auth/useAuth';

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, hasPermission } = useAuth();
  const { register, handleSubmit } = useForm<LoginData>();

  const handleLogin: SubmitHandler<LoginData> = async (data) => {
    try {
      setIsLoading(true);
      await login(data.username, data.password);
      if (hasPermission("admin.access")) {
        navigate('/admin');
      }
      else if (hasPermission("admin.users.manage")) {
        navigate('/admin/usuarios');
      }
      else if (hasPermission("users.read")) {
        navigate('/perfil');
      }
      else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Error al iniciar sesión. Por favor, verifica tus credenciales e intenta de nuevo.');
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section con imagen de fondo */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/95 z-0">
          <div className="absolute inset-0 opacity-20">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1653201587864-c6280a0bb4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyaW5nJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc2MTA5NTQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Ingeniería Civil"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md px-4">
          <Card className="shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10 text-primary-foreground" />
              </div>
              <CardTitle>Iniciar Sesión</CardTitle>
              <CardDescription>
                Accede al portal del Colegio de Ingenieros Civiles de Bolivia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="rnic">RNIC</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="rnic"
                      placeholder="XXXXXX"
                      className="pl-10"
                      required
                      {...register("username")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña(RNI)</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>

              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Volver al Inicio
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6 text-primary-foreground/80">
            <p>© 2025 Colegio de Ingenieros Civiles de Bolivia</p>
          </div>
        </div>
      </div>
    </div>
  );
}
