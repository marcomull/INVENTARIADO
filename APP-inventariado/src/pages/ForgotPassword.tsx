import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success('Si el correo existe, enviaremos las instrucciones.');
  };

  return (
    <PublicLayout
      title="Recupera tu acceso"
      subtitle="Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña."
    >
      {sent ? (
        <div className="text-center py-4 space-y-4 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <div>
            <p className="font-medium">Revisa tu correo</p>
            <p className="text-sm text-muted-foreground mt-1">
              Hemos enviado las instrucciones a <span className="font-medium text-foreground">{email}</span>.
            </p>
          </div>
          <Link to="/login">
            <Button variant="outline" className="rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver al login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tucorreo@bloom.pe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl h-11"
            />
          </div>
          <Button type="submit" className="w-full h-11 rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow font-medium">
            Enviar instrucciones
          </Button>
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground pt-2">
            <ArrowLeft className="w-4 h-4" /> Volver al login
          </Link>
        </form>
      )}
    </PublicLayout>
  );
}
