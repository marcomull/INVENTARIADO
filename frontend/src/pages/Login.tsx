import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error ?? 'Error al iniciar sesión');
      return;
    }
    toast.success('¡Bienvenido/a de vuelta!');
    navigate('/', { replace: true });
  };

  const fillDemo = (mail: string) => {
    setEmail(mail);
    setPassword('admin123');
  };

  return (
    <PublicLayout title="Hola de nuevo 👋" subtitle="Ingresa con tu cuenta para continuar.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="marcoarias765@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="rounded-xl h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="rounded-xl h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Mostrar contraseña"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow font-medium">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ingresar'}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border/60">
        <p className="text-xs text-muted-foreground mb-3 text-center">Cuentas disponibles en Base de Datos</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemo('marcoarias765@gmail.com')}
            className="text-xs px-3 py-2 rounded-lg bg-primary-soft text-primary hover:bg-primary/20 transition-smooth font-medium"
          >
            👑 Marco (Admin)
          </button>
          <button
            type="button"
            onClick={() => fillDemo('vendedor@inventario.com')}
            className="text-xs px-3 py-2 rounded-lg bg-accent-soft text-accent-foreground hover:bg-accent/30 transition-smooth font-medium"
          >
            🧑‍💼 Vendedor
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">Contraseña: <code className="font-mono">admin123</code></p>
      </div>
    </PublicLayout>
  );
}